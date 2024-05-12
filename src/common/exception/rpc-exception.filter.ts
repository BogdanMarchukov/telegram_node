import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MyLoggerService } from 'src/modules/my-logger/my-logger.service';
import { getUserFromHost } from '../helpers/context.helper';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  constructor(private logService: MyLoggerService) {}

  catch(exception: RpcException, host: ArgumentsHost) {
    const user = getUserFromHost(host);
    this.logService.errorLogs(exception.getError() as any, user);

    return 'ошибка';
  }
}
