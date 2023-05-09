import { User } from '../../models/User.model';
import { TelegrafContext } from '../types';

export default async (ctx: TelegrafContext, next) => {
  const user = await User.findOne({
    where: {
      chatId: ctx.update.message.chat.id,
    },
  });
  if (!user) {
    ctx.state.user = await User.create({
      userName: ctx.update?.message?.from?.username,
      firstName: ctx.update?.message?.from?.first_name,
      chatId: ctx.update?.message?.chat?.id,
    });
  } else {
    ctx.state.user = user;
  }
  await next();
};
