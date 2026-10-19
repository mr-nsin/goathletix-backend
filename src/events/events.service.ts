import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';

const EVENT_COLUMNS =
  'id, source_id, event_name, sport_type, description, slug, start_date, end_date, city, state, venue, distance_options, elevation_gain, difficulty, price_range, registration_url, registration_opens_at, registration_closes_at, poster_url, is_popular, age_categories, discipline_slugs, organizer_id, organizer_name, club_id, is_club_activity, interest_count, terrain, is_virtual, status, created_at, updated_at';

const EVENT_SELECT = `${EVENT_COLUMNS}, organizer:organizers(id, name, logo_url, website_url, is_verified)`;

/**
 * Event page columns beyond the list select (GA-043, GA-048). Every column here is verified against
 * an APPLIED migration (0014, 0016, 0022, 0023, 0025). Never add a column from an unapplied draft:
 * PostgREST errors on an unknown column and the whole page 500s.
 */
const EVENT_DETAIL_COLUMNS = [
  // 0022 ticketing
  'social_share_image_url',
  'ticketing_mode',
  'max_tickets_per_order',
  // 0023 overview and timing
  'tagline',
  'start_time',
  'end_time',
  'reporting_time',
  // 0014 certification, timing and course
  'is_certified',
  'certifying_body',
  'is_chip_timed',
  'timing_partner',
  'altitude_m',
  'course_map_url',
  // 0023 course and venue
  'aid_stations',
  'amenities',
  'safety_info',
  'address_line',
  'pincode',
  'venue_notes',
  // 0022 + 0023 policies
  'refund_policy',
  'transfer_policy',
  'deferral_policy',
  'cancellation_policy',
  'terms_text',
  'waiver_text',
  // 0023 pricing and contact
  'tax_mode',
  'gst_rate',
  'waitlist_enabled',
  'contact_email',
  'contact_phone',
  'whatsapp_url',
  // 0025 race-day logistics
  'bib_expo_opens_at',
  'bib_expo_closes_at',
  'certificate_available_at',
  // 0016 results, 0014 ratings
  'results_url',
  'rating_avg',
  'rating_count',
].join(', ');

/** `organizers` has no `page_url` column, so it is not selected. */
const EVENT_DETAILS_SELECT = `${EVENT_COLUMNS}, ${EVENT_DETAIL_COLUMNS}, organizer:organizers(id, name, logo_url, website_url, instagram_url, cover_url, is_verified)`;

const TICKET_TYPE_SELECT =
  'id, label, discipline_slug, distance_km, age_categories, gender, start_time, cutoff_minutes, capacity, slots_taken, price_inr, is_sold_out, sort_order, ' +
  // 0022 inclusions and sales window
  'description, includes, sales_start_at, sales_end_at, max_per_order, ' +
  // 0023 eligibility
  'min_age, max_age, age_as_on_date, required_documents, qualifying_standard, team_size_min, team_size_max, eligibility_notes, ' +
  'event_price_tiers(id, label, price_inr, valid_from, valid_until)';

const MEDIA_SELECT =
  'id, url, kind, caption, credit, edition_year, is_cover, created_at';

const FAQ_SELECT = 'question, answer, sort_order, created_at';

const SCHEDULE_SELECT = 'title, starts_at, ends_at, notes, sort_order';

const SPONSOR_SELECT =
  'name, tier, logo_url, website_url, sort_order, created_at';

/** Display rank of `event_sponsors.tier` (CHECK constraint in 0023); unknown tiers sort last. */
const SPONSOR_TIER_RANK: Record<string, number> = {
  title: 0,
  presenting: 1,
  gold: 2,
  silver: 3,
  partner: 4,
  media: 5,
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** PostgREST / Postgres codes for "this relation does not exist". */
const MISSING_TABLE_CODES = new Set(['PGRST205', '42P01']);

export interface PriceTier {
  id: string;
  label: string;
  price_inr: number;
  valid_from: string | null;
  valid_until: string | null;
}

interface TicketTypeRow {
  id: string;
  label: string;
  sort_order: number | null;
  event_price_tiers?: PriceTier[] | null;
  [key: string]: unknown;
}

interface MediaRow {
  id: string;
  url: string;
  kind: 'photo' | 'video';
  caption: string | null;
  credit: string | null;
  edition_year: number | null;
  is_cover: boolean;
  created_at: string | null;
}

interface FaqRow {
  question: string;
  answer: string;
  sort_order: number | null;
  created_at: string | null;
}

interface SponsorRow {
  name: string;
  tier: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number | null;
  created_at: string | null;
}

interface ScheduleRow {
  title: string;
  starts_at: string;
  ends_at: string | null;
  notes: string | null;
  sort_order: number | null;
}

/** Today's calendar date in India (YYYY-MM-DD), which is what tier validity dates mean. */
export function todayInIst(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(
    now,
  );
}

/** Ascending string compare with nulls first. ISO dates compare correctly as strings. */
function compareNullsFirst(a: string | null, b: string | null): number {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return a < b ? -1 : 1;
}

/** Ascending string compare with nulls last. */
function compareNullsLast(a: string | null, b: string | null): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a < b ? -1 : 1;
}

/** Tiers ordered by valid_from, nulls first, then valid_until (open-ended last). */
export function sortTiers(tiers: PriceTier[]): PriceTier[] {
  return [...tiers].sort(
    (a, b) =>
      compareNullsFirst(a.valid_from, b.valid_from) ||
      compareNullsLast(a.valid_until, b.valid_until),
  );
}

/**
 * The tier whose [valid_from, valid_until] window (inclusive, null = unbounded) contains `today`.
 * When several match (an undated "Regular" alongside a dated "Early bird"), the most specific wins:
 * latest valid_from, then earliest valid_until.
 */
export function pickCurrentTierId(
  tiers: PriceTier[],
  today: string,
): string | null {
  const matching = tiers.filter(
    (t) =>
      (t.valid_from === null || t.valid_from <= today) &&
      (t.valid_until === null || t.valid_until >= today),
  );
  if (matching.length === 0) return null;
  matching.sort(
    (a, b) =>
      compareNullsFirst(b.valid_from, a.valid_from) ||
      compareNullsLast(a.valid_until, b.valid_until),
  );
  return matching[0].id;
}

export function shapeTicketTypes(rows: TicketTypeRow[], today: string) {
  return [...rows]
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
        a.label.localeCompare(b.label),
    )
    .map(({ event_price_tiers, ...ticketType }) => {
      const tiers = sortTiers(event_price_tiers ?? []).map((t) => ({
        id: t.id,
        label: t.label,
        price_inr: t.price_inr,
        valid_from: t.valid_from,
        valid_until: t.valid_until,
      }));
      return {
        ...ticketType,
        tiers,
        current_tier_id: pickCurrentTierId(tiers, today),
      };
    });
}

/** Cover first, then newest edition (undated last), then newest upload. */
export function shapeMedia(rows: MediaRow[]) {
  return [...rows]
    .sort(
      (a, b) =>
        Number(b.is_cover) - Number(a.is_cover) ||
        (b.edition_year ?? -Infinity) - (a.edition_year ?? -Infinity) ||
        compareNullsLast(b.created_at, a.created_at),
    )
    .map(({ id, url, kind, caption, credit, edition_year, is_cover }) => ({
      id,
      url,
      kind,
      caption,
      credit,
      edition_year,
      is_cover,
    }));
}

/** Organiser's sort_order first, then tier rank (title before media), then oldest first. */
export function shapeSponsors(rows: SponsorRow[]) {
  const rank = (tier: string) =>
    SPONSOR_TIER_RANK[tier] ?? Object.keys(SPONSOR_TIER_RANK).length;
  return [...rows]
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
        rank(a.tier) - rank(b.tier) ||
        compareNullsLast(a.created_at, b.created_at),
    )
    .map(({ name, tier, logo_url, website_url }) => ({
      name,
      tier,
      logo_url,
      website_url,
    }));
}

/**
 * Sport-family -> sport-slug lookup, backing the `family` filter. The `sports` table changes
 * rarely, so it is cached in memory for the process lifetime after the first request rather
 * than queried per-request. Keyed per SupabaseClient instance to keep this test-friendly.
 */
const sportsByFamilyCache = new WeakMap<
  SupabaseClient,
  Promise<Map<string, string[]>>
>();

async function loadSportsByFamily(
  client: SupabaseClient,
): Promise<Map<string, string[]>> {
  let cached = sportsByFamilyCache.get(client);
  if (!cached) {
    cached = (async () => {
      const { data, error } = await client
        .from('sports')
        .select('slug, family');
      if (error) {
        throw error;
      }
      const map = new Map<string, string[]>();
      for (const row of (data ?? []) as { slug: string; family: string }[]) {
        const slugs = map.get(row.family) ?? [];
        slugs.push(row.slug);
        map.set(row.family, slugs);
      }
      return map;
    })();
    // A failed lookup must not poison the cache forever — let the next call retry.
    cached.catch(() => sportsByFamilyCache.delete(client));
    sportsByFamilyCache.set(client, cached);
  }
  return cached;
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Resolve the inclusive date window a query filters on, or null when unfiltered.
 *
 * Applied as a range OVERLAP, not equality (ADR-001): a five-day stage race running 28 Sep to
 * 2 Oct belongs in BOTH September and October, so the test is
 * `start_date <= rangeEnd AND end_date >= rangeStart`. `end_date` is backfilled to equal
 * `start_date` for single-day events and a CHECK keeps it >= start_date, so no null guard is needed.
 */
/**
 * Split a comma-separated filter value into clean terms.
 *
 * Commas, parentheses, `%`, `*` and backslashes are stripped from each term because PostgREST
 * parses `or=(...)` as a logic tree — unescaped, they would corrupt the filter rather than be
 * matched literally.
 */
function splitTerms(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.replace(/[(),%*\\]/g, ' ').trim())
    .filter(Boolean);
}

function resolveDateWindow(
  query: GetEventsQueryDto,
): { start: string; end: string } | null {
  const { month, year, dateFrom, dateTo } = query;

  // An explicit range wins over month/year when both are supplied.
  if (dateFrom || dateTo) {
    return { start: dateFrom ?? '0001-01-01', end: dateTo ?? '9999-12-31' };
  }
  if (year && month) {
    return {
      start: toDateOnly(new Date(Date.UTC(year, month - 1, 1))),
      end: toDateOnly(new Date(Date.UTC(year, month, 0))),
    };
  }
  if (year) {
    return {
      start: toDateOnly(new Date(Date.UTC(year, 0, 1))),
      end: toDateOnly(new Date(Date.UTC(year, 11, 31))),
    };
  }
  return null;
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Log the full error including its `cause` chain. Supabase surfaces transport failures as a
   * bare `TypeError: fetch failed`, whose actual reason (DNS, TLS, ECONNREFUSED, proxy) lives
   * only on `cause` — without this, outages are undiagnosable from the logs.
   */
  private logSupabaseError(context: string, error: unknown) {
    type ErrorLike = {
      name?: unknown;
      message?: unknown;
      code?: unknown;
      cause?: unknown;
    };

    const parts: string[] = [];
    let current: unknown = error;

    for (let depth = 0; current && depth < 5; depth++) {
      const e = current as ErrorLike;
      const name = typeof e.name === 'string' ? e.name : '';
      const message =
        typeof e.message === 'string' ? e.message : '(no message)';
      const code =
        typeof e.code === 'string' || typeof e.code === 'number'
          ? ` code=${e.code}`
          : '';
      const prefix = depth === 0 ? '' : `cause[${depth}] `;
      parts.push(`${prefix}${name}: ${message}${code}`);
      current = e.cause;
    }

    this.logger.error(`${context} -> ${parts.join(' | ')}`);
  }

  async findAll(query: GetEventsQueryDto) {
    const { search, sport, city, state, difficulty, popular, family } = query;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let builder = this.supabase.client
      .from('events')
      .select(EVENT_SELECT, { count: 'exact' })
      // Service-role key bypasses RLS, so public visibility is enforced here (GA-022). The same
      // builder carries the `count: 'exact'` total, so meta.total matches the rows.
      .eq('visibility', 'public')
      .eq('publication_status', 'published');

    if (search) {
      // Strip anything tsquery would read as an operator, so user input is matched literally.
      const term = search.replace(/[(),%*\\:&|!'"<>]/g, ' ').trim();
      if (term) {
        // `search_vector` is a GENERATED STORED tsvector over event_name, venue, city, state and
        // organizer_name — that last one is what finally makes organiser search work, since
        // PostgREST cannot reach an embedded column from .or().
        //
        // Every token gets the `:*` prefix operator and they are AND'd. This matters because the
        // directory debounces and queries WHILE THE USER TYPES: `websearch_to_tsquery` matches
        // whole words only, so "Mumb" found nothing and the box read as broken until a complete
        // word was entered. `to_tsquery('simple','mumb:*')` matches from the first keystroke.
        // Passing no `type` selects the plain `fts` operator, which is the one that accepts `:*`.
        const tsquery = term
          .split(/\s+/)
          .filter(Boolean)
          .map((token) => `${token}:*`)
          .join(' & ');
        builder = builder.textSearch('search_vector', tsquery, {
          config: 'simple',
        });
      }
    }

    if (sport) {
      builder = builder.eq('sport_type', sport);
    }

    if (family) {
      const sportsByFamily = await loadSportsByFamily(this.supabase.client);
      const slugs = sportsByFamily.get(family) ?? [];
      builder = builder.in('sport_type', slugs.length > 0 ? slugs : ['']);
    }

    const disciplines = query.disciplines ? splitTerms(query.disciplines) : [];
    if (disciplines.length > 0) {
      builder = builder.overlaps('discipline_slugs', disciplines);
    }

    const ageCategories = query.ageCategories
      ? splitTerms(query.ageCategories)
      : [];
    if (ageCategories.length > 0) {
      builder = builder.overlaps('age_categories', ageCategories);
    }

    // Popular Events (main-page carousel): only events flagged is_popular.
    if (popular === 'true' || popular === '1') {
      builder = builder.eq('is_popular', true);
    }

    // Multi-value: `city=Mumbai,Pune` OR's the terms. Separate .or() groups are AND'd by
    // PostgREST, so city and state narrow each other as expected.
    const cities = city ? splitTerms(city) : [];
    if (cities.length === 1) {
      builder = builder.ilike('city', cities[0]);
    } else if (cities.length > 1) {
      builder = builder.or(cities.map((c) => `city.ilike.${c}`).join(','));
    }

    const states = state ? splitTerms(state) : [];
    if (states.length === 1) {
      builder = builder.ilike('state', states[0]);
    } else if (states.length > 1) {
      builder = builder.or(states.map((s) => `state.ilike.${s}`).join(','));
    }

    if (difficulty) {
      builder = builder.eq('difficulty', difficulty);
    }

    const window = resolveDateWindow(query);
    if (window) {
      builder = builder
        .lte('start_date', window.end)
        .gte('end_date', window.start);
    }

    const { data, count, error } = await builder
      .order('start_date', { ascending: true })
      .range(from, to);

    if (error) {
      this.logSupabaseError('findAll', error);
      throw new InternalServerErrorException('Failed to fetch events');
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: data ?? [],
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    if (!UUID_REGEX.test(id)) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    const { data, error } = await this.supabase.client
      .from('events')
      .select(EVENT_SELECT)
      .eq('id', id)
      // Non-public or unpublished events 404 exactly like a missing row (GA-022).
      .eq('visibility', 'public')
      .eq('publication_status', 'published')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return data;
  }
  /**
   * Everything the event page needs in one call (GA-043). The event is resolved first with the same
   * public + published filter as findOne, so a private or draft event 404s before any child table
   * is read. Child rows are then fetched in parallel and ordered here, not in SQL.
   */
  async findDetails(id: string) {
    if (!UUID_REGEX.test(id)) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    const client = this.supabase.client;

    const { data: row, error } = await client
      .from('events')
      .select(EVENT_DETAILS_SELECT)
      .eq('id', id)
      .eq('visibility', 'public')
      .eq('publication_status', 'published')
      .maybeSingle();

    if (error) {
      this.logSupabaseError('findDetails', error);
      throw new InternalServerErrorException(error.message);
    }
    if (!row) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    const [ticketRes, mediaRes, faqRes, scheduleRes, sponsorRes] =
      await Promise.all([
        client
          .from('event_categories')
          .select(TICKET_TYPE_SELECT)
          .eq('event_id', id)
          // Hidden ticket types are sold only through an access code (0022).
          .eq('is_hidden', false),
        client
          .from('event_media')
          .select(MEDIA_SELECT)
          .eq('event_id', id)
          .eq('status', 'published'),
        client.from('event_faqs').select(FAQ_SELECT).eq('event_id', id),
        client
          .from('event_schedule_items')
          .select(SCHEDULE_SELECT)
          .eq('event_id', id),
        client.from('event_sponsors').select(SPONSOR_SELECT).eq('event_id', id),
      ]);

    const ticketRows = this.rowsOrThrow<TicketTypeRow>(
      'findDetails:event_categories',
      ticketRes,
    );
    const mediaRows = this.rowsOrThrow<MediaRow>(
      'findDetails:event_media',
      mediaRes,
    );
    const faqRows = this.rowsOrThrow<FaqRow>('findDetails:event_faqs', faqRes, {
      allowMissingTable: true,
    });
    const scheduleRows = this.rowsOrThrow<ScheduleRow>(
      'findDetails:event_schedule_items',
      scheduleRes,
      { allowMissingTable: true },
    );
    const sponsorRows = this.rowsOrThrow<SponsorRow>(
      'findDetails:event_sponsors',
      sponsorRes,
      { allowMissingTable: true },
    );

    // The select is assembled from a column list, so supabase-js cannot infer the row type.
    const { organizer, ...event } = row as unknown as Record<
      string,
      unknown
    > & {
      organizer?: unknown;
    };

    return {
      data: {
        event,
        organizer: organizer ?? null,
        ticket_types: shapeTicketTypes(ticketRows, todayInIst()),
        media: shapeMedia(mediaRows),
        faqs: [...faqRows]
          .sort(
            (a, b) =>
              (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
              compareNullsLast(a.created_at, b.created_at),
          )
          .map(({ question, answer }) => ({ question, answer })),
        schedule: [...scheduleRows]
          .sort(
            (a, b) =>
              compareNullsLast(a.starts_at, b.starts_at) ||
              (a.sort_order ?? 0) - (b.sort_order ?? 0),
          )
          .map(({ title, starts_at, ends_at, notes }) => ({
            title,
            starts_at,
            ends_at,
            notes,
          })),
        sponsors: shapeSponsors(sponsorRows),
      },
    };
  }

  /** Unwrap a child-table result: [] for no rows, 500 on error (or [] for an absent table). */
  private rowsOrThrow<T>(
    context: string,
    result: { data: unknown; error: unknown },
    options: { allowMissingTable?: boolean } = {},
  ): T[] {
    if (result.error) {
      const code = (result.error as { code?: unknown }).code;
      if (
        options.allowMissingTable &&
        typeof code === 'string' &&
        MISSING_TABLE_CODES.has(code)
      ) {
        return [];
      }
      this.logSupabaseError(context, result.error);
      throw new InternalServerErrorException('Failed to fetch event details');
    }
    return (result.data ?? []) as T[];
  }
}
