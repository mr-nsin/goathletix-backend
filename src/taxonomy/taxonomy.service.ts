import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

interface DisciplineRow {
  slug: string;
  display_name: string;
  kind: string;
  is_active: boolean;
}

interface SportRow {
  slug: string;
  display_name: string;
  family: string;
  event_model: string;
  phase: number;
  disciplines: DisciplineRow[];
}

export interface TaxonomyDiscipline {
  slug: string;
  displayName: string;
  kind: string;
}

export interface TaxonomySport {
  slug: string;
  displayName: string;
  family: string;
  eventModel: string;
  phase: number;
  disciplines: TaxonomyDiscipline[];
}

@Injectable()
export class TaxonomyService {
  private readonly logger = new Logger(TaxonomyService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Sports with their active disciplines, nested. Both `sports` and `disciplines` are
   * filtered to `is_active = true` and ordered per the API contract: sports by phase then
   * display_name, disciplines by display_name.
   */
  async findAllSports(): Promise<TaxonomySport[]> {
    const { data, error } = await this.supabase.client
      .from('sports')
      .select(
        'slug, display_name, family, event_model, phase, disciplines(slug, display_name, kind, is_active)',
      )
      .eq('is_active', true)
      .order('phase', { ascending: true })
      .order('display_name', { ascending: true });

    if (error) {
      this.logger.error(`findAllSports -> ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch sports taxonomy');
    }

    const rows = (data ?? []) as unknown as SportRow[];

    return rows.map((row) => ({
      slug: row.slug,
      displayName: row.display_name,
      family: row.family,
      eventModel: row.event_model,
      phase: row.phase,
      disciplines: row.disciplines
        .filter((d) => d.is_active)
        .sort((a, b) => a.display_name.localeCompare(b.display_name))
        .map((d) => ({
          slug: d.slug,
          displayName: d.display_name,
          kind: d.kind,
        })),
    }));
  }
}
