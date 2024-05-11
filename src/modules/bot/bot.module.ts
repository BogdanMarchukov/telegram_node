import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getUserMiddleware from '../../common/middlewars/get-user.middleware';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MyLoggerModule } from '../my-logger/my-logger.module';
import { MetricsModule } from '../metrics/metrics.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from '../notification/notification.module';
import { RmqServise } from 'src/common/types';
import { RootKeys } from 'src/config/type';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';

@Module({
  imports: [
    EventEmitterModule,
    ScheduleModule.forRoot(),
    MetricsModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>(RootKeys.Token),
        middlewares: [getUserMiddleware],
        handlerTimeout: 9000000,
      }),
    }),
    MyLoggerModule,
    NotificationModule,
  ],
  providers: [
    BotService,
    BotUpdate,
    {
      provide: RmqServise.GptService,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get(RootKeys.RmqUrl)],
            queue: configService.get(RootKeys.GptQueue),
            queueOptions: {
              durable: false,
            },
          },
        });
      },

      inject: [ConfigService],
    },
  ],
})
export class BotModule {}
