import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { BotModule } from './telegram/bot.module';
import configuration from "./common/config/configuration";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }), BotModule],
})
export class AppModule {}
