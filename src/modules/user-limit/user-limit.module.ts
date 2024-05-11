import { Module } from '@nestjs/common';
import { UserLimitSubscriptionService } from './user-limit.subscription.service';

@Module({
  providers: [UserLimitSubscriptionService],
})
export class UserLimitModule {}
