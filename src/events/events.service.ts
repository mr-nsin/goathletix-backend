import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';

const EVENT_SELECT =
  'id, source_id, event_name, sport_type, event_date, city, state, venue, distance_options, elevation_gain, difficulty, price_range, registration_url, organizer_id, terrain, is_virtual, status, created_at, updated_at, organizer:organizers(id, name, logo_url, website_url, is_verified)';

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class EventsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query: GetEventsQueryDto) {
    const { search, sport, city, difficulty, month, year } = query;
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

    if (year && month) {
      const startDateVal = toDateOnly(new Date(Date.UTC(year, month - 1, 1)));
      const endDateVal = toDateOnly(new Date(Date.UTC(year, month, 0)));
      builder = builder.gte('event_date', startDateVal).lte('event_date', endDateVal);
    } else if (year) {
      const startDateVal = toDateOnly(new Date(Date.UTC(year, 0, 1)));
      const endDateVal = toDateOnly(new Date(Date.UTC(year, 11, 31)));
      builder = builder.gte('event_date', startDateVal).lte('event_date', endDateVal);
    }

    const { data, count, error } = await builder
      .order('event_date', { ascending: true })
      .range(from, to);

    if (error) {
      throw new InternalServerErrorException(error.message);
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
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
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
