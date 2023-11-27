import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { cancel, gptMainManu, mainManu } from './buttons';
import { User } from '../../models/User.model';
import { BotService } from './bot.service';
import { RoleType } from '../../common/types';
import { MyLoggerService } from '../my-logger/my-logger.service';
import { MetricsService } from '../metrics/metrics.service';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';

@Update()
export class BotUpdate {
  private lastActiveAdminNewsletter: User;
  constructor(
    private readonly botService: BotService,
    private readonly logger: MyLoggerService,
    private readonly metricsService: MetricsService,
    private readonly notificationService: NotificationService,
  ) { }

  @Cron('0 10 * * *')
  async sentMetrics() {
    const activeUser = await this.metricsService.getMetricsForDay();
    await this.logger.sentMetricActiveUser(activeUser);
  }

  @Cron('59 23 * * *')
  async setActiveUserForDay() {
    this.metricsService.setMetricsForDay();
  }

  @Start()
  async start(ctx: Context) {
    const user: User = ctx.state.user.user;
    if (ctx.state.user.isNewUser) {
      this.logger.createUser(user);
    }
    await ctx.reply(`Привет ${user.firstName || user.userName}`);
    await ctx.reply('Главное меню', mainManu());
  }

  @Hears('GhatGpt')
  async getGptMainManu(ctx: Context) {
    await ctx.reply('Это меню управления чатами Gtp', gptMainManu(ctx.state?.user?.user));
  }

  @Hears('Рассылка')
  async newsletter(ctx: Context) {
    const user: User = ctx.state.user.user;
    if (!user.isAdmin) {
      await ctx.reply('Не достаточно прав');
    }
    this.lastActiveAdminNewsletter = user;
    await ctx.reply('Отправьте текст рассылки', cancel());
  }

  @Hears('Главное меню')
  async returnMainManu(ctx: Context) {
    const user: User = ctx.state.user.user;
    await user.update({
      activeChatId: null,
    });
    await ctx.reply('Выберети услугу', mainManu());
  }

  @Hears('Новый чат')
  async createNawChat(ctx: Context) {
    const user: User = ctx.state.user.user;
    const data = await this.botService.senderToGpt(ctx, () =>
      this.botService.createNawChat(user, `Привет, меня зовут ${user.firstName || user.userName}`),
    );
    await user.update({
      activeChatId: data.id,
    });
    await ctx.reply(this.botService.getAssistantText(data.message));
  }

  @Hears('VPN')
  async sendVpnMenu(cxt: Context) {
    await cxt.reply('Скоро. Сервис в разработке');
  }

  @Hears('Отмена')
  async resetNotification(ctx: Context) {
    const user: User = ctx.state.user.user;
    if (user.isAdmin) {
      this.lastActiveAdminNewsletter = undefined;
      ctx.reply('Рассылка отменена', gptMainManu(user));
    }
    await ctx.reply('Привет', gptMainManu(user));
  }

  @On('voice')
  async sendAudio(ctx: any) {
    const user: User = ctx.state.user.user;
    const fileId = ctx?.update?.message?.voice?.file_id;
    if (user && fileId && user.activeChatId) {
      const href = (await ctx.telegram.getFileLink(ctx.update.message.voice.file_id)).toString();
      await this.botService.senderToGpt(ctx, () => {
        return this.botService.sendAudioMessage(user.activeChatId, href, user.id);
      });
    }
  }

  @On('message')
  async continueChat(ctx: any) {
    const user: User = ctx.state.user.user;
    const message = ctx.message?.text;
    console.log(message, 'messate');

    if (user.isAdmin && user.id === this.lastActiveAdminNewsletter?.id && message) {
      await this.notificationService.sendNotification(message);
      this.lastActiveAdminNewsletter = undefined;
      ctx.reply('Рассылка выполненна', gptMainManu(user));
      return;
    }

    if (user.activeChatId && message) {
      const data = await this.botService.senderToGpt(ctx, () => {
        return this.botService.sendMessageToActiveChat(
          user.activeChatId,
          {
            role: RoleType.User,
            content: message,
          },
          user.id,
        );
      });

      await ctx.reply(this.botService.getAssistantText(data.message));
    } else {
      await ctx.reply('Выберети услугу', mainManu());
    }
  }
}
