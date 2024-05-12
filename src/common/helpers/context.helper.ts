import { ArgumentsHost } from '@nestjs/common';
import { User } from 'src/models/User.model';

export function getUserFromHost(host: ArgumentsHost): User {
  const data = host.switchToRpc().getData();
  const user: User = data?.state?.user?.user;
  return user;
}
