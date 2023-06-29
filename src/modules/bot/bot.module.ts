import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getUserMiddleware from '../../common/middlewars/get-user.middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyLoggerModule } from '../my-logger/my-logger.module';
import * as process from 'process';
import { MetricsModule } from '../metrics/metrics.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MetricsModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('token'),
        middlewares: [getUserMiddleware],
        handlerTimeout: 9000000,
      }),
    }),
    ClientsModule.register([
      {
        name: 'GPT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RMQ_HOST}:5672`],
          queue: 'gpt_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MyLoggerModule,
    NotificationModule,
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
