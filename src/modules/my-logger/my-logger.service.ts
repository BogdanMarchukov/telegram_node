import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../models/User.model';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { RootKeys } from 'src/config/type';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  constructor(private readonly configService: ConfigService, @InjectBot() private readonly bot: Telegraf<Context>) {
    super();
  }
  private readonly logChatId = this.configService.get<string>(RootKeys.LogChatId);

  async createUser(user: User) {
    const countUsers = await User.count();
    return this.bot.telegram.sendMessage(this.logChatId, `Новый пользователь ${user.userName} ${user.firstName}, всего: ${countUsers}`);
  }

  async sentMetricActiveUser(userCount: number) {
    return this.bot.telegram.sendMessage(this.logChatId, `Активных пользователей: ${userCount} `);
  }

  async errorLogs(error: { status: string; message: string } | string, user: User) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return this.bot.telegram.sendMessage(
      this.logChatId,
      `error: ${errorMessage}, from user ${user?.userName || ''} ${user?.firstName || ''}`,
    );
  }
}
