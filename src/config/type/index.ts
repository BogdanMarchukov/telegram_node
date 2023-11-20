export enum RootKeys {
  Token = 'token',
  Url = 'url',
  Database = 'database',
  GptQueue = 'gpt_queue',
  LogChatId = 'logChatId',
  NotificationChatId = 'notificationChatId',
  RmqUrl = 'rmqUrl',
}
interface Database {
  dialect: string;
  host: string;
  username: string;
  database: string;
  password: string;
  port: number;
}

export interface Config {
  [RootKeys.Token]: string;
  [RootKeys.Url]: string;
  [RootKeys.GptQueue]: string;
  [RootKeys.LogChatId]: string;
  [RootKeys.NotificationChatId]: number;
  [RootKeys.Database]: Database;
  [RootKeys.RmqUrl]: string;
}
