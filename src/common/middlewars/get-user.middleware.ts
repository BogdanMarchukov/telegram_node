import { NotFoundException } from '@nestjs/common';
import { Limit } from 'src/models/Limit.model';
import { UserLimit } from 'src/models/UserLimit.model';
import { User } from '../../models/User.model';
import { TelegrafContext } from '../types';

export default async (ctx: TelegrafContext, next) => {
  let user: User;
  let userLimit: UserLimit;
  if (ctx.update?.message?.chat?.id) {
    user = await User.findOne({
      where: {
        chatId: ctx.update?.message?.chat?.id,
      },
      include: { model: UserLimit },
    });
  }
  if (!user) {
    const defaultLimit = await Limit.findOne({ where: { isDefault: true } });
    if (!defaultLimit) {
      throw new NotFoundException('error');
    }
    user = await User.create({
      userName: ctx.update?.message?.from?.username,
      firstName: ctx.update?.message?.from?.first_name,
      chatId: ctx.update?.message?.chat?.id,
    });
    userLimit = await UserLimit.create({
      limitId: defaultLimit.id,
      userId: user.id,
      requestAmount: defaultLimit.requestAmount,
    });
    ctx.state.user = {
      userLimit,
      user,
      isNewUser: true,
    };
  } else {
    ctx.state.user = {
      userLimit: user.userLimit,
      user,
      isNewUser: false,
    };
  }
  await next();
};
