import { Hears, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { gptMainManu, mainManu } from './buttons';
import { User } from '../../models/User.model';
import { BotService } from './bot.service';
import { RoleType } from '../../common/types';

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
    const user: User = ctx.state.user;
    await user.update({
      activeChatId: null,
    });
    await ctx.reply('Выберети услугу', mainManu());
  }

  @Hears('Новый чат')
  async createNawChat(ctx: Context) {
    const user: User = ctx.state.user;
    await this.bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    try {
      const result = await this.botService.createNawChat(
        user,
        `Привет, меня зовут ${user.firstName || user.userName}`,
      );
      await user.update({
        activeChatId: result.id,
      });

      await ctx.reply(this.botService.getAssistantText(result.message));
    } catch (e) {
      await ctx.reply('ошибка');
    }
  }

  @Hears('VPN')
  async sendVpnMenu(cxt: Context) {
    await cxt.reply('Скоро. Сервис в разработке');
  }

  @On('message')
  async continueChat(ctx: any) {
    try {
      const user: User = ctx.state.user;
      if (user.activeChatId && ctx.message.text) {
        await this.bot.telegram.sendChatAction(ctx.chat.id, 'typing');
        const result = await this.botService.sendMessageToActiveChat(
          user.activeChatId,
          {
            role: RoleType.User,
            content: ctx.message.text,
          },
          user.id,
        );
        await ctx.reply(this.botService.getAssistantText(result.message));
      }
      {
        await ctx.reply('Выберети услугу', mainManu());
      }
    } catch (e) {
      await ctx.reply('ошибка');
    }
  }
}
