import { EventsService } from './events.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(query: GetEventsQueryDto): Promise<{
        data: ({
            organizer: {
                id: string;
                name: string;
                websiteUrl: string | null;
                logoUrl: string | null;
                isVerified: boolean;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            sourceId: string;
            eventName: string;
            sportType: import("@prisma/client").$Enums.SportCategory;
            city: string;
            state: string;
            venue: string;
            distanceOptions: string[];
            elevationGain: string | null;
            difficulty: import("@prisma/client").$Enums.DifficultyLevel;
            priceRange: string | null;
            registrationUrl: string;
            organizerId: string | null;
            terrain: string | null;
            isVirtual: boolean;
            status: import("@prisma/client").$Enums.EventStatus;
            md5PayloadHash: string;
            updatedAt: Date;
            startDate: Date;
            endDate: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        organizer: {
            id: string;
            name: string;
            websiteUrl: string | null;
            logoUrl: string | null;
            isVerified: boolean;
            createdAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        sourceId: string;
        eventName: string;
        sportType: import("@prisma/client").$Enums.SportCategory;
        city: string;
        state: string;
        venue: string;
        distanceOptions: string[];
        elevationGain: string | null;
        difficulty: import("@prisma/client").$Enums.DifficultyLevel;
        priceRange: string | null;
        registrationUrl: string;
        organizerId: string | null;
        terrain: string | null;
        isVirtual: boolean;
        status: import("@prisma/client").$Enums.EventStatus;
        md5PayloadHash: string;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
    }>;
}
