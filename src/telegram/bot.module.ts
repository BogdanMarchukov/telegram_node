import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import {TelegramOptionsFactory} from "../common/fectorys/TelegramOptionsFactory";
import {TelegramModule} from "nest-telegram";

@Module({
  imports: [TelegramModule.forRootAsync({
    imports: [TelegramOptionsFactory],
    useClass: TelegramOptionsFactory
  })],
  controllers: [BotController],
  providers: [BotService]
})
export class BotModule {}
