import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/models/User.model';
import { EventNames, EventPayloads } from './types';

@Injectable()
export class EventEmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  getRequestFromGpt(user: User) {
    const payload: EventPayloads[EventNames.GET_REQUEST_FROM_GPT] = { user };
    this.eventEmitter.emit(EventNames.GET_REQUEST_FROM_GPT, payload);
  }
}
