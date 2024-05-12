import { User } from 'src/models/User.model';

export enum EventNames {
  GET_REQUEST_FROM_GPT = 'GET_REQUEST_FROM_GPT',
}

export interface EventPayloads {
  [EventNames.GET_REQUEST_FROM_GPT]: { user: User };
}
