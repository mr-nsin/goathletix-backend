import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SportCategory, DifficultyLevel } from '@prisma/client';

export class GetEventsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SportCategory)
  sport?: SportCategory;

  @IsOptional()
  @IsString()
  city?: string;

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
}
