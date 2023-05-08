import { Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { actionActionsButton } from './buttons';

@Update()
export class BotUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async start(ctx: Context) {
    console.log(ctx);
    await ctx.reply('hello');
    await ctx.reply('test', actionActionsButton());
  }

  @Hears('GhatGpt')
  async test(ctx: Context) {
    console.log(ctx.state.user);
    await ctx.reply('это тест');
  }
}
