import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetEventsQueryDto) {
    const { search, sport, city, difficulty, month, year } = query;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;
    const take = limit;

    const filters: Prisma.EventWhereInput[] = [];

    if (search) {
      filters.push({
        OR: [
          { eventName: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { venue: { contains: search, mode: 'insensitive' } },
          {
            organizer: {
              is: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        ],
      });
    }

    if (sport) {
      filters.push({ sportType: sport });
    }

    if (city) {
      filters.push({ city: { equals: city, mode: 'insensitive' } });
    }

    if (difficulty) {
      filters.push({ difficulty });
    }

    if (year && month) {
      const startDateVal = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endDateVal = new Date(Date.UTC(year, month, 0, 23, 59, 59));
      filters.push(this.overlapsDateRange(startDateVal, endDateVal));
    } else if (year) {
      const startDateVal = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const endDateVal = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
      filters.push(this.overlapsDateRange(startDateVal, endDateVal));
    }

    const where: Prisma.EventWhereInput =
      filters.length > 0 ? { AND: filters } : {};

    const [total, data] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: {
          startDate: 'asc',
        },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              websiteUrl: true,
              isVerified: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  private overlapsDateRange(
    startDate: Date,
    endDate: Date,
  ): Prisma.EventWhereInput {
    return {
      AND: [
        { startDate: { lte: endDate } },
        {
          OR: [
            { endDate: { gte: startDate } },
            { endDate: null, startDate: { gte: startDate } },
          ],
        },
      ],
    };
  }

  async findOne(id: string) {
    // Validate UUID format before querying to avoid DB errors
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return event;
  }
}
