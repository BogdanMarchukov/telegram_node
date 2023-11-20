import * as process from 'process';
import { Config, RootKeys } from './type';

export default (): Config => ({
  [RootKeys.Token]: process.env.TOKEN,
  [RootKeys.Url]: process.env.URL,
  [RootKeys.Database]: {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT),
  },
  [RootKeys.GptQueue]: process.env.GPT_QUEUE,
  [RootKeys.LogChatId]: process.env.LOG_CHAT_ID,
  [RootKeys.NotificationChatId]: parseInt(process.env.NOTIFICATION_CHAT_ID),
  [RootKeys.RmqUrl]: process.env.RMQ_URL,
});
