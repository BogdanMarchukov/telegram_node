import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../models/User.model';
import { ClientProxy } from '@nestjs/microservices';
import { retry, timeout } from 'rxjs';
import { GptResponse, MessageGpt } from '../../common/types';

@Injectable()
export class BotService {
  constructor(@Inject('GPT_SERVICE') private gptClient: ClientProxy) {}

  createNawChat(user: User, startMessage: string): Promise<GptResponse> {
    return new Promise((resolve, reject) => {
      this.gptClient
        .send('createChat', {
          commonId: user.id,
          startMessage,
          userName: user.firstName,
        })
        .pipe(timeout(15000))
        .subscribe({
          next: (data) => resolve(data),
          error: (error) => reject(error),
        });
    });
  }

  sendMessageToActiveChat(
    activeChatId: string,
    message: MessageGpt,
    commonId,
  ): Promise<GptResponse> {
    return new Promise((resolve, reject) => {
      this.gptClient
        .send('continueChat', {
          activeChatId,
          message,
          commonId,
        })
        .pipe(timeout(15000), retry(2))
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
