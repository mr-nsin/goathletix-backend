import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityGateway } from './activity.gateway';
import { ActivityAction } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(
    private prisma: PrismaService,
    private gateway: ActivityGateway,
  ) {}

  async getRecentActivities(limit: number = 20) {
    return this.prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createActivity(data: {
    userId?: string;
    userDisplayName?: string;
    actionType: ActivityAction;
    targetId: string;
    targetName: string;
  }) {
    const activity = await this.prisma.activityLog.create({
      data,
    });
    
    // Broadcast via websocket
    this.gateway.broadcastNewActivity(activity);
    
    return activity;
  }
}
