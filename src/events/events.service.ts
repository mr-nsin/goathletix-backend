import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

    const from = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (search) {
      where.eventName = { contains: search, mode: 'insensitive' };
    }
    if (sport) {
      where.sportType = sport as any;
    }
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (difficulty) {
      where.difficulty = difficulty as any;
    }
    if (year && month) {
      const startDateVal = new Date(Date.UTC(year, month - 1, 1));
      const endDateVal = new Date(Date.UTC(year, month, 0));
      where.startDate = { gte: startDateVal, lte: endDateVal };
    } else if (year) {
      const startDateVal = new Date(Date.UTC(year, 0, 1));
      const endDateVal = new Date(Date.UTC(year, 11, 31));
      where.startDate = { gte: startDateVal, lte: endDateVal };
    }

    try {
      const total = await this.prisma.event.count({ where });
      const data = await this.prisma.event.findMany({
        where,
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
        orderBy: {
          startDate: 'asc',
        },
        skip: from,
        take: limit,
      });

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
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    try {
      const data = await this.prisma.event.findUnique({
        where: { id },
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
      });

      if (!data) {
        throw new NotFoundException(`Event with ID "${id}" not found`);
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
