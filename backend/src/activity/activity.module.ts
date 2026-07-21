import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityGateway } from './activity.gateway';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService, ActivityGateway],
  exports: [ActivityService, ActivityGateway],
})
export class ActivityModule {}
