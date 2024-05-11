import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/http-exeption-filter';
import { RpcExceptionFilter } from './common/exception/rpc-exception.filter';
import { MyLoggerService } from './modules/my-logger/my-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(MyLoggerService));
  app.useGlobalFilters(new RpcExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
