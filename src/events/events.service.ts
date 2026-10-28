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
  // 0026 event-page fields (GA-050): requirements, policies, course, badges, safety, urgency
  'sport_details',
  'mandatory_gear',
  'recommended_gear',
  'fitness_requirement',
  'changes_allowed_until',
  'kit_collection_mandatory',
  'race_day_collection',
  'gpx_url',
  'elevation_gain_m',
  'sanction_reference',
  'edition_number',
  'women_safety',
  'sponsorship_contact',
  'closes_when_sold_out',
  // 0026 event social links (organiser social links are on the organizer join below)
  'instagram_url',
  'facebook_url',
  'youtube_url',
  'x_url',
  'linkedin_url',
  'strava_url',
  'hashtag',
].join(', ');

/** `organizers` has no `page_url` column, so it is not selected. */
const EVENT_DETAILS_SELECT = `${EVENT_COLUMNS}, ${EVENT_DETAIL_COLUMNS}, organizer:organizers(id, name, logo_url, website_url, instagram_url, cover_url, is_verified, facebook_url, youtube_url, x_url, linkedin_url, strava_url, whatsapp_url)`;

const TICKET_TYPE_SELECT =
  'id, label, discipline_slug, distance_km, age_categories, gender, start_time, cutoff_minutes, capacity, slots_taken, price_inr, is_sold_out, sort_order, ' +
  // 0022 inclusions and sales window
  'description, includes, sales_start_at, sales_end_at, max_per_order, ' +
  // 0023 eligibility
  'min_age, max_age, age_as_on_date, required_documents, qualifying_standard, team_size_min, team_size_max, eligibility_notes, ' +
  // 0026 per-sport ticket-type facts and extras (GA-050)
  'sport_details, is_timed, compare_at_price_inr, excludes, team_composition, ticket_kind, session_starts_on, session_ends_on, deposit_inr, balance_due_days, course_map_url, ' +
  'event_price_tiers(id, label, price_inr, valid_from, valid_until)';

const MEDIA_SELECT =
  'id, url, kind, caption, credit, edition_year, is_cover, created_at';

const FAQ_SELECT = 'question, answer, sort_order, created_at';

const SCHEDULE_SELECT = 'title, starts_at, ends_at, notes, sort_order';

const SPONSOR_SELECT =
  'name, tier, logo_url, website_url, sort_order, created_at';

// 0026 event child tables (GA-050). Column names grep-verified against
// `supabase/migrations/20261019000026_event_page_fields.sql`. Ordered in SQL by the real sort
// column from the migration — `sort_order` on four of them, `seq` on event_checkpoints which
// has no `sort_order`. Each fetch is wrapped in a try/catch so one failing child-table does
// not 500 the whole /details response (log the failure, return []).
const AWARD_SELECT =
  'id, category_id, scope, age_band, gender, position_from, position_to, cash_inr, prize_text, min_entries_female, min_entries_male, sort_order';
const CHECKPOINT_SELECT =
  'id, category_id, seq, name, km, location, cutoff_at, cutoff_after_minutes, services, notes';
const RESOURCE_SELECT = 'id, category_id, kind, label, url, sort_order';
const OFFER_SELECT =
  'id, category_id, label, audience, discount_type, discount_value, min_qty, valid_from, valid_until, terms, is_active, sort_order';
const ITINERARY_SELECT =
  'id, day_no, title, description, distance_km, duration_text, start_altitude_m, end_altitude_m, meals, stay, sort_order';

// GA-060: published reviews. `author:profiles(full_name)` embeds through the single FK
// event_reviews.user_id -> profiles.id. `user_id` and `updated_at` are deliberately NOT selected.
const REVIEW_SELECT =
  'id, rating, title, body, edition_year, category_label, helpful_count, created_at, author:profiles(full_name)';
const REVIEW_LIST_LIMIT = 20;
const REVIEW_DISTRIBUTION_CAP = 10000;

interface ReviewRow {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  edition_year: number | null;
  category_label: string | null;
  helpful_count: number;
  created_at: string;
  author?:
    { full_name?: string | null } | { full_name?: string | null }[] | null;
}

export interface RatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

/** Privacy: first name + last initial ("Priya Sharma" -> "Priya S."); never the stored full name. */
export function toAuthorName(fullName: string | null | undefined): string {
  const words = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'Participant';
  const name =
    words.length === 1
      ? words[0]
      : `${words[0]} ${words[words.length - 1][0].toUpperCase()}.`;
  return name.slice(0, 40);
}

export function shapeReviews(rows: ReviewRow[]) {
  return rows.map((r) => {
    const author = Array.isArray(r.author) ? r.author[0] : r.author;
    return {
      id: r.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      edition_year: r.edition_year,
      category_label: r.category_label,
      helpful_count: r.helpful_count,
      created_at: r.created_at,
      author_name: toAuthorName(author?.full_name),
    };
  });
}

/** Counted from rating rows; null when they do not account for `count` (never invent one). */
export function buildDistribution(
  ratings: { rating: number }[],
  count: number,
): RatingDistribution | null {
  const dist: RatingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  let total = 0;
  for (const { rating } of ratings) {
    const key = String(rating) as keyof RatingDistribution;
    if (key in dist) {
      dist[key] += 1;
      total += 1;
    }
  }
  return total === count ? dist : null;
}

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

// 0026 child-table row shapes. snake_case passthrough (CLAUDE.md §6): the service does not
// rename or reshape — these interfaces just document what safeChildRows returns.
// Exported so the controller's inferred return type can name them (TS4053).
export interface AwardRow {
  id: string;
  category_id: string | null;
  scope: string;
  age_band: string | null;
  gender: string | null;
  position_from: number;
  position_to: number;
  cash_inr: number | null;
  prize_text: string | null;
  min_entries_female: number | null;
  min_entries_male: number | null;
  sort_order: number;
}

export interface CheckpointRow {
  id: string;
  category_id: string | null;
  seq: number;
  name: string;
  km: number | null;
  location: string | null;
  cutoff_at: string | null;
  cutoff_after_minutes: number | null;
  services: string[];
  notes: string | null;
}

export interface ResourceRow {
  id: string;
  category_id: string | null;
  kind: string;
  label: string;
  url: string;
  sort_order: number;
}

export interface OfferRow {
  id: string;
  category_id: string | null;
  label: string;
  audience: string;
  discount_type: string;
  discount_value: number;
  min_qty: number;
  valid_from: string | null;
  valid_until: string | null;
  terms: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ItineraryRow {
  id: string;
  day_no: number;
  title: string;
  description: string | null;
  distance_km: number | null;
  duration_text: string | null;
  start_altitude_m: number | null;
  end_altitude_m: number | null;
  meals: string[];
  stay: string | null;
  sort_order: number;
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

    const [
      ticketRes,
      mediaRes,
      faqRes,
      scheduleRes,
      sponsorRes,
      awardsRows,
      checkpointsRows,
      resourcesRows,
      offersRows,
      itineraryRows,
      reviewRows,
      ratingRows,
    ] = await Promise.all([
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
      // GA-050 child tables added by migration 0026. Each is isolated: one failing
      // fetch returns [] for that section only (see safeChildRows).
      this.safeChildRows<AwardRow>('findDetails:event_awards', () =>
        client
          .from('event_awards')
          .select(AWARD_SELECT)
          .eq('event_id', id)
          .order('sort_order', { ascending: true, nullsFirst: false }),
      ),
      this.safeChildRows<CheckpointRow>('findDetails:event_checkpoints', () =>
        client
          .from('event_checkpoints')
          .select(CHECKPOINT_SELECT)
          .eq('event_id', id)
          .order('seq', { ascending: true, nullsFirst: false }),
      ),
      this.safeChildRows<ResourceRow>('findDetails:event_resources', () =>
        client
          .from('event_resources')
          .select(RESOURCE_SELECT)
          .eq('event_id', id)
          .order('sort_order', { ascending: true, nullsFirst: false }),
      ),
      this.safeChildRows<OfferRow>('findDetails:event_offers', () =>
        client
          .from('event_offers')
          .select(OFFER_SELECT)
          .eq('event_id', id)
          .order('sort_order', { ascending: true, nullsFirst: false }),
      ),
      this.safeChildRows<ItineraryRow>('findDetails:event_itinerary_days', () =>
        client
          .from('event_itinerary_days')
          .select(ITINERARY_SELECT)
          .eq('event_id', id)
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('day_no', { ascending: true, nullsFirst: false }),
      ),
      // GA-060: service-role bypasses RLS, so status = 'published' is filtered here.
      this.safeChildRows<ReviewRow>('findDetails:event_reviews', () =>
        client
          .from('event_reviews')
          .select(REVIEW_SELECT)
          .eq('event_id', id)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(REVIEW_LIST_LIMIT),
      ),
      this.safeChildRows<{ rating: number }>(
        'findDetails:event_reviews_ratings',
        () =>
          client
            .from('event_reviews')
            .select('rating')
            .eq('event_id', id)
            .eq('status', 'published')
            .limit(REVIEW_DISTRIBUTION_CAP),
      ),
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

    const ratingCount = Number(event.rating_count ?? 0) || 0;
    const ratingAvg = Number(event.rating_avg);
    const ratingSummary = {
      avg:
        ratingCount > 0 && event.rating_avg != null && !Number.isNaN(ratingAvg)
          ? Math.round(ratingAvg * 10) / 10
          : null,
      count: ratingCount,
      distribution: buildDistribution(ratingRows, ratingCount),
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
        awards: awardsRows,
        checkpoints: checkpointsRows,
        resources: resourcesRows,
        offers: offersRows,
        itinerary_days: itineraryRows,
        reviews: shapeReviews(reviewRows),
        rating_summary: ratingSummary,
      },
    };
  }

  /**
   * Fetch a 0026 child-table row set that must never 500 the whole details response.
   * Any error — a transport failure, a Supabase/PostgREST error row, an exception from the
   * builder itself — is logged and swallowed, and `[]` is returned. The parent event has
   * already been resolved against RLS-equivalent filters above, so an empty section is a
   * safe fallback for the frontend (every GA-050 field is treated as optional).
   */
  private async safeChildRows<T>(
    context: string,
    build: () => PromiseLike<{ data: unknown; error: unknown }>,
  ): Promise<T[]> {
    try {
      const { data, error } = await build();
      if (error) {
        this.logSupabaseError(context, error);
        return [];
      }
      return (data ?? []) as T[];
    } catch (e) {
      this.logSupabaseError(context, e);
      return [];
    }
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
