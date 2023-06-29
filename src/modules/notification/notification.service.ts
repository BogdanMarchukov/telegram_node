import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { User } from '../../models/User.model';

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async sendNotification(message: string) {
    const where = { isAdmin: false };
    const userCount = await User.count({
      where,
    });
    for (let offset = 0; offset < userCount; offset = offset + 100) {
      const users = await User.findAll({
        where,
        limit: 100,
        offset,
      });
      for (const user of users) {
        await this.bot.telegram.sendMessage(user.chatId, message);
      }
    }
  }
}
