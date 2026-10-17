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

  // Registered before ':id'. Express would not match '/events/x/details' against ':id' anyway
  // (a param does not span '/'), but keeping the more specific route first makes the intent explicit.
  @Get(':id/details')
  async findDetails(@Param('id') id: string) {
    return this.eventsService.findDetails(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}
