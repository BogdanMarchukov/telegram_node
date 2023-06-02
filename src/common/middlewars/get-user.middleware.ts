import { User } from '../../models/User.model';
import { TelegrafContext } from '../types';

export default async (ctx: TelegrafContext, next) => {
  let user;
  if (ctx.update?.message?.chat?.id) {
    user = await User.findOne({
      where: {
        chatId: ctx.update?.message?.chat?.id,
      },
    });
  }
  if (!user) {
    ctx.state.user = {
      user: await User.create({
        userName: ctx.update?.message?.from?.username,
        firstName: ctx.update?.message?.from?.first_name,
        chatId: ctx.update?.message?.chat?.id,
      }),
      isNewUser: true,
    };
  } else {
    ctx.state.user = {
      user,
      isNewUser: false,
    };
  }
  await next();
};
