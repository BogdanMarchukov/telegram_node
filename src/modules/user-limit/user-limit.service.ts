import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserLimit } from 'src/models/UserLimit.model';

@Injectable()
export class UserLimitService {
  @Cron('59 23 * * *')
  async setActiveUserForDay() {
    await this.updateAllUsersLimit();
  }

  private async updateAllUsersLimit() {
    const allUsers = await UserLimit.findAll();
    for (const user of allUsers) {
      await user.resetRequestAmount();
    }
  }
}
