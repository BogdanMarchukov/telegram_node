import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../models/User.model';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  constructor(
    private readonly configService: ConfigService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {
    super();
  }
  private readonly logChatId = this.configService.get<string>('logChatId');

  async createUser(user: User) {
    const countUsers = await User.count();
    return this.bot.telegram.sendMessage(
      this.logChatId,
      `Новый пользователь ${user.userName} ${user.firstName}, всего: ${countUsers}`,
    );
  }
}
