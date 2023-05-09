import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../models/User.model';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class BotService {
  constructor(@Inject('GPT_SERVICE') private gptClient: ClientProxy) {}

  createNawChat(user: User, startMessage: string) {
    return new Promise((resolve, reject) => {
      this.gptClient
        .send('createChat', {
          commonId: user.id,
          startMessage,
          userName: user.firstName,
        })
        .pipe(timeout(10000))
        .subscribe({
          next: (data) => resolve(data),
          error: (error) => reject(error),
        });
    });
  }
}
