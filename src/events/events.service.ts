import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';

const EVENT_SELECT =
  'id, source_id, event_name, sport_type, start_date, end_date, city, state, venue, distance_options, elevation_gain, difficulty, price_range, registration_url, organizer_id, terrain, is_virtual, status, created_at, updated_at, organizer:organizers(id, name, logo_url, website_url, is_verified)';

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
    const { search, sport, city, difficulty } = query;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let builder = this.supabase.client
      .from('events')
      .select(EVENT_SELECT, { count: 'exact' });

    if (search) {
      builder = builder.ilike('event_name', `%${search}%`);
    }

    if (sport) {
      builder = builder.eq('sport_type', sport);
    }

    if (city) {
      builder = builder.ilike('city', city);
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
