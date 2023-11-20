import { Injectable } from '@nestjs/common';
import { User } from '../../models/User.model';
import { Op } from 'sequelize';
import { DateTime } from 'luxon';
import { Metric } from 'src/models/Metric.model';

@Injectable()
export class MetricsService {
  async getMetricsForDay(): Promise<number> {
    const metric = await Metric.findOne({ order: [['createdAt', 'DESC']] });
    return metric?.activeUser || 0;
  }

  async setMetricsForDay() {
    const userCount = await this.getDailyActiveUsers();
    Metric.create({
      activeUser: userCount,
    });
  }

  private async getDailyActiveUsers() {
    return User.count({
      where: {
        lastActiveAt: {
          [Op.gte]: DateTime.now().startOf('day').toISO(),
          [Op.lte]: DateTime.now().endOf('day').toISO(),
        },
      },
    });
  }
}
