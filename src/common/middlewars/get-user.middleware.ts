import { User } from '../../models/User.model';
import { TelegrafContext } from '../types';

export default async (ctx: TelegrafContext, next) => {
  let user: User;
  if (ctx.update?.message?.chat?.id) {
    user = await User.findOne({
      where: {
        chatId: ctx.update?.message?.chat?.id,
      },
    });
  }
  if (!user) {
    user = await User.create({
      userName: ctx.update?.message?.from?.username,
      firstName: ctx.update?.message?.from?.first_name,
      chatId: ctx.update?.message?.chat?.id,
    });
    ctx.state.user = {
      user,
      isNewUser: true,
    };
  } else {
    ctx.state.user = {
      user,
      isNewUser: false,
    };
  }
  user.update({
    lastActiveAt: new Date(),
  });
  await next();
};
