import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/models/User.model';
import { UserLimit } from 'src/models/UserLimit.model';
import { ErrorMessage } from '../types';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToRpc().getData();
    data.error = {
      message: 'error limit guard',
    };
    const user = this.getUserFromContext(context);
    if (!user) {
      return false;
    }
    if (user.isAdmin) {
      return true;
    }
    const userLimit = this.gerUserLimit(context);
    if (!userLimit) {
      return false;
    }
    const passLimit = this.checkUserLimit(context, userLimit);
    if (!passLimit) {
      return false;
    }
    return user.isActive;
  }

  private getUserFromContext(context: ExecutionContext): User | null {
    const data = context.switchToRpc().getData();
    const user: User = data?.state?.user?.user || null;
    if (!user) {
      data.error = {
        message: ErrorMessage.SYSTEM_ERROR_USER_NOT_FOUND,
      };
    }
    return user;
  }

  private gerUserLimit(context: ExecutionContext): UserLimit | null {
    const data = context.switchToRpc().getData();
    const userLimit: UserLimit = data?.state?.user?.userLimit || null;
    if (!userLimit) {
      data.error = {
        message: ErrorMessage.SYSTEM_ERROR_USER_NOT_FOUND,
      };
    }
    return userLimit;
  }

  private checkUserLimit(context: ExecutionContext, userLimit: UserLimit) {
    const data = context.switchToRpc().getData();
    const pass = userLimit.requestAmount > 0;
    if (!pass) {
      data.error = {
        message: ErrorMessage.REQUEST_LIMIT,
      };
    }
    return pass;
  }
}
