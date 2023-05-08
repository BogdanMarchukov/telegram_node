import { TelegramModuleOptions, TelegramModuleOptionsFactory } from "nest-telegram";
import { ConfigService } from "@nestjs/config";
import * as process from "process";

export class TelegramOptionsFactory implements TelegramModuleOptionsFactory {
    constructor(private configService: ConfigService) {}

    createOptions(): TelegramModuleOptions {
        return {
            token: process.env.TOKEN,
            sitePublicUrl: process.env.URL,
        }
    }
}