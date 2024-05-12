import { Module } from '@nestjs/common';
import { UserLimitService } from './user-limit.service';
import { UserLimitSubscriptionService } from './user-limit.subscription.service';

@Module({
  providers: [UserLimitSubscriptionService, UserLimitService],
})
export class UserLimitModule {}
