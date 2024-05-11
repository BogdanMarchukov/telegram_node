import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/models/User.model';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToRpc().getData();
    data.error = {
      message: 'error limit guard',
    };
    const user: User = data.state.user.user;
    return false;
  }
}
