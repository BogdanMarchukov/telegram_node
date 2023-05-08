import { Context } from 'telegraf';

export default async (ctx: Context, next) => {
  ctx.state.user = { user: 1 };
  await next();
};
