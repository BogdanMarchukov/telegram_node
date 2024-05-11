interface Chat {
  id: number;
  first_name: string;
  username: string;
  type: string;
}
interface From {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
}

interface Message {
  message_id: number;
  from: From;
  chat: Chat;
  date: number;
  text: string;
}

interface Update {
  update_id: number;
  message: Message;
}

export interface TelegrafContext {
  update: Update;
  telegram: any;
  botInfo: any;
  state: any;
}

export enum RoleType {
  Assistant = 'assistant',
  User = 'user',
}

export type MessageGpt = {
  role: RoleType;
  content: string;
};

export type GptResponse = {
  id: string;
  message: MessageGpt[];
};

export enum RmqServise {
  GptService = 'GPT_SERVICE',
}

export enum ErrorMessage {
  REQUEST_LIMIT = 'Суточный лимит исчерпан.',
}
