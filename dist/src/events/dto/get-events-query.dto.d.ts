import { SportCategory, DifficultyLevel } from '@prisma/client';
export declare class GetEventsQueryDto {
    search?: string;
    sport?: SportCategory;
    city?: string;
    difficulty?: DifficultyLevel;
    page?: number;
    limit?: number;
    month?: number;
    year?: number;
}
