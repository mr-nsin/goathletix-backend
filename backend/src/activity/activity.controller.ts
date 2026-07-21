import { Controller, Get, Post, Body } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityAction } from '@prisma/client';
import { Public } from '../auth/public.decorator';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get()
  async getRecentActivities() {
    return this.activityService.getRecentActivities();
  }

  @Public()
  @Post()
  async createActivity(
    @Body()
    data: {
      userId?: string;
      userDisplayName?: string;
      actionType: ActivityAction;
      targetId: string;
      targetName: string;
    },
  ) {
    return this.activityService.createActivity(data);
  }
}
