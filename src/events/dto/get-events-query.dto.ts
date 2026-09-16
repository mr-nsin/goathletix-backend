import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  SportCategory,
  DifficultyLevel,
  AgeCategory,
  SportFamily,
} from '@prisma/client';

const AGE_CATEGORY_VALUES = Object.values(AgeCategory).join('|');

export class GetEventsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SportCategory)
  sport?: SportCategory;

  /**
   * One or more cities, comma-separated (`city=Mumbai,Pune`). Matched case-insensitively and
   * OR'd together. A single value keeps the previous behaviour, so existing callers such as
   * `/locations/[city]` are unaffected.
   */
  @IsOptional()
  @IsString()
  city?: string;

  /** "true"/"1" → only events flagged is_popular (main-page Popular Events). */
  @IsOptional()
  @IsString()
  popular?: string;

  /** One or more states, comma-separated (`state=Maharashtra,Goa`). Same semantics as `city`. */
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  /**
   * Inclusive date range, `YYYY-MM-DD`. Matched by overlap against
   * `start_date`/`end_date`, so a multi-day event is returned if any part of it
   * falls inside the range. Takes precedence over `month`/`year`.
   *
   * Kept as validated strings rather than `Date` — the column is `@db.Date`, and
   * parsing to a JS Date would reintroduce a timezone offset.
   */
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateFrom must be a date string in YYYY-MM-DD format',
  })
  dateFrom?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateTo must be a date string in YYYY-MM-DD format',
  })
  dateTo?: string;

  /**
   * One or more discipline slugs, comma-separated (`disciplines=marathon,badminton`).
   * Matched against `events.discipline_slugs` (an array column) — an event is returned if
   * it carries at least one of the requested slugs.
   */
  @IsOptional()
  @IsString()
  disciplines?: string;

  /**
   * One or more age categories, comma-separated (`ageCategories=kids,junior`). Matched
   * against `events.age_categories` (an array column). Values are restricted to the
   * `AgeCategory` enum so an unknown value fails validation rather than silently matching
   * nothing.
   */
  @IsOptional()
  @Matches(
    new RegExp(`^(${AGE_CATEGORY_VALUES})(,(${AGE_CATEGORY_VALUES}))*$`),
    {
      message: `ageCategories must be a comma-separated list of: ${Object.values(AgeCategory).join(', ')}`,
    },
  )
  ageCategories?: string;

  /**
   * A single sport family (`family=athletics`). Resolved to the sports that belong to that
   * family via the `sports` table, then filtered on `events.sport_type`.
   */
  @IsOptional()
  @IsEnum(SportFamily)
  family?: SportFamily;
}
