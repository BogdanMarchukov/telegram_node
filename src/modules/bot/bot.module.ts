import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getUserMiddleware from '../../common/middlewars/get-user.middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('token'),
        middlewares: [getUserMiddleware],
      }),
    }),
    ClientsModule.register([
      {
        name: 'GPT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'gpt_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
