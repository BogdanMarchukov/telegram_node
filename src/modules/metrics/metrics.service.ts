import { Injectable } from '@nestjs/common';
import { User } from '../../models/User.model';
import { Op } from 'sequelize';
import { DateTime } from 'luxon';

@Injectable()
export class MetricsService {
  async getDailyActiveUsers() {
    return User.count({
      where: {
        lastActiveAt: {
          [Op.gte]: DateTime.now().minus({ day: 1 }).startOf('day').toISO(),
          [Op.lte]: DateTime.now().minus({ day: 1 }).endOf('day').toISO(),
        },
      },
    });
  }
}
