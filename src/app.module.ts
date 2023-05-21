import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { BotModule } from './modules/bot/bot.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/User.model';
import { MyLoggerModule } from './modules/my-logger/my-logger.module';

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
        dialect: configService.get('database.dialect') || 'postgres',
        host: configService.get('database.host') || '127.0.0.1',
        port: +configService.get('database.port') || 5430,
        username: configService.get('database.userName') || 'postgres',
        password: configService.get('database.password') || 'mysecretpassword',
        database: configService.get('database.database') || 'postgres',
        models: [User],
      }),
      inject: [ConfigService],
    }),
    MyLoggerModule,
  ],
})
export class AppModule {}
