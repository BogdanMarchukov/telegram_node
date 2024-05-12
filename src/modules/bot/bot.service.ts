import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../models/User.model';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { timeout, timer } from 'rxjs';
import { GptResponse, MessageGpt, RmqServise } from '../../common/types';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { EventEmitterService } from '../event-emitter/event-emitter.service';

@Injectable()
export class BotService {
  constructor(
    @Inject(RmqServise.GptService) private gptClient: ClientProxy,
    @InjectBot() private readonly bot: Telegraf<Context>,
    private eventEmitterService: EventEmitterService,
  ) {}

  async senderToGpt(ctx: Context, cb: () => Promise<GptResponse>, user: User): Promise<GptResponse> {
    const intervalStatus = timer(500, 5000).subscribe({
      next: () => this.bot.telegram.sendChatAction(ctx.chat.id, 'typing'),
    });
    try {
      const result = await cb();
      this.eventEmitterService.getRequestFromGpt(user);
      intervalStatus.unsubscribe();
      return result;
    } catch (error) {
      intervalStatus.unsubscribe();
      throw new RpcException(error);
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
        .pipe(timeout(30 * 1000))
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
        .pipe(timeout(60 * 1000))
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

  getAssistantText(message: MessageGpt[]) {
    return message[message.length - 1].content;
  }
}
