import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { BotModule } from './modules/bot/bot.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/User.model';
import { MyLoggerModule } from './modules/my-logger/my-logger.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { NotificationModule } from './modules/notification/notification.module';
import { RootKeys } from './config/type';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BotModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get(RootKeys.Database)?.dialect,
        host: configService.get(RootKeys.Database)?.host,
        port: configService.get(RootKeys.Database)?.port,
        username: configService.get(RootKeys.Database)?.username,
        password: configService.get(RootKeys.Database)?.password,
        database: configService.get(RootKeys.Database)?.database,
        models: [User],
      }),
      inject: [ConfigService],
    }),
    MyLoggerModule,
    MetricsModule,
    NotificationModule,
  ],
})
export class AppModule { }
