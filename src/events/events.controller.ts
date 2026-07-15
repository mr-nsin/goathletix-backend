import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(@Query() query: GetEventsQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}
