import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../models/User.model';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, timer } from 'rxjs';
import { GptResponse, MessageGpt, RmqServise } from '../../common/types';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { MyLoggerService } from '../my-logger/my-logger.service';

@Injectable()
export class BotService {
  constructor(
    @Inject(RmqServise.GptService) private gptClient: ClientProxy,
    @InjectBot() private readonly bot: Telegraf<Context>,
    private logService: MyLoggerService,
  ) { }

  async senderToGpt(ctx: Context, cb: () => Promise<GptResponse>) {
    const intervalStatus = timer(500, 5000).subscribe({
      next: () => this.bot.telegram.sendChatAction(ctx.chat.id, 'typing'),
    });
    try {
      const result = await cb();
      await ctx.reply(this.getAssistantText(result.message));
      intervalStatus.unsubscribe();
    } catch (error) {
      intervalStatus.unsubscribe();
      this.logService.errorLogs(error, ctx.state.user.user);
      ctx.reply('Ошибка');
    }
  }

  createNawChat(user: User, startMessage: string): Promise<GptResponse> {
    return new Promise((resolve, reject) => {
      this.gptClient
        .send('createChat', {
          commonId: user.id,
          startMessage,
          userName: user.firstName,
        })
        .pipe(timeout(2 * 60 * 1000))
        .subscribe({
          next: (data) => resolve(data),
          error: (error) => reject(error),
        });
    });
  }

  sendMessageToActiveChat(activeChatId: string, message: MessageGpt, commonId: string): Promise<GptResponse> {
    return new Promise((resolve, reject) => {
      this.gptClient
        .send('continueChat', {
          activeChatId,
          message,
          commonId,
        })
        .subscribe({
          next: (data) => resolve(data),
          error: (error) => reject(error),
        });
    });
  }

  sendAudioMessage(activeChatId: string, href: string, commonId: string): Promise<GptResponse> {
    return new Promise((resolve, reject) => {
      this.gptClient
        .send('replayAudio', {
          activeChatId,
          href,
          commonId,
        })
        .subscribe({
          next: (data) => resolve(data),
          error: (error) => reject(error),
        });
    });
  }

  private getAssistantText(message: MessageGpt[]) {
    return message[message.length - 1].content;
  }
}
