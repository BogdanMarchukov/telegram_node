import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getUserMiddleware from '../common/middlewars/get-user.middleware';

//const sessions = new LocalSession({ database: 'session.json' });

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
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
