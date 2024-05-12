import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { MyLoggerService } from 'src/modules/my-logger/my-logger.service';
import { getUserFromHost } from '../helpers/context.helper';
import { ErrorMessage } from '../types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logService: MyLoggerService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const data = host.switchToRpc().getData();
    const user = getUserFromHost(host);
    let message: ErrorMessage = data?.error?.message || ErrorMessage.DEFAULT;
    switch (message) {
      case ErrorMessage.SYSTEM_ERROR_USER_NOT_FOUND:
      case ErrorMessage.SYSTEM_ERROR_USER_LIMIT_NOT_FOUND:
        await this.logService.errorLogs(message, user);
        message = ErrorMessage.DEFAULT;
        break;
      default:
        await this.logService.errorLogs(message, user);
    }

    return message;
  }
}
