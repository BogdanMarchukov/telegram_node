import { Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { gptMainManu, mainManu } from './buttons';
import { User } from '../../models/User.model';
import { BotService } from './bot.service';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
  ) {}

  @Start()
  async start(ctx: Context) {
    const user: User = ctx.state.user;
    await ctx.reply(`Привет ${user.firstName || user.userName}`);
    await ctx.reply('Главное меню', mainManu());
  }

  @Hears('GhatGpt')
  async getGptMainManu(ctx: Context) {
    await ctx.reply('Это меню управления чатами Gtp', gptMainManu());
  }

  @Hears('Главное меню')
  async returnMainManu(ctx: Context) {
    await ctx.reply('Это меню управления чатами Gtp', mainManu());
  }

  @Hears('Новый чат')
  async createNawChat(ctx: Context) {
    try {
      const result = await this.botService.createNawChat(
        ctx.state.user,
        'hellow gpt',
      );
      console.log(result, 'result');

      await ctx.reply('ok');
    } catch (e) {
      await ctx.reply('ошибка');
    }
  }
}
