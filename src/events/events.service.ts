import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';

const EVENT_SELECT =
  'id, source_id, event_name, sport_type, description, slug, start_date, end_date, city, state, venue, distance_options, elevation_gain, difficulty, price_range, registration_url, registration_opens_at, registration_closes_at, poster_url, is_popular, age_categories, discipline_slugs, organizer_id, organizer_name, club_id, is_club_activity, interest_count, terrain, is_virtual, status, created_at, updated_at, organizer:organizers(id, name, logo_url, website_url, is_verified)';

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
      .select(EVENT_SELECT, { count: 'exact' });

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
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    const { data, error } = await this.supabase.client
      .from('events')
      .select(EVENT_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return data;
  }
}
