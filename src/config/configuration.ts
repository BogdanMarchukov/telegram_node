import * as process from 'process';

export default () => ({
  token: process.env.TOKEN,
  url: process.env.URL,
  database: {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  },
  gpt_queue: process.env.GPT_QUEUE,
});
