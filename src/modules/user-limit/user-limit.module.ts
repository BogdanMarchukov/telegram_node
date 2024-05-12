import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserLimitService } from './user-limit.service';
import { UserLimitSubscriptionService } from './user-limit.subscription.service';

@Module({
  providers: [UserLimitSubscriptionService, UserLimitService],
  imports: [ScheduleModule.forRoot()],
})
export class UserLimitModule {}
