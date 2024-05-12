import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserLimit } from 'src/models/UserLimit.model';
import { EventNames, EventPayloads } from '../event-emitter/types';

@Injectable()
export class UserLimitSubscriptionService {
  @OnEvent(EventNames.GET_REQUEST_FROM_GPT)
  async decrementUserLimit(payload: EventPayloads[EventNames.GET_REQUEST_FROM_GPT]) {
    const userLimit = await UserLimit.findOne({ where: { userId: payload.user.id } });
    await userLimit.decrementRequestAmount();
  }
}
