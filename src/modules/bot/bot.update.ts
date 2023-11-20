import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { gptMainManu, mainManu } from './buttons';
import { User } from '../../models/User.model';
import { BotService } from './bot.service';
import { RoleType } from '../../common/types';
import { MyLoggerService } from '../my-logger/my-logger.service';
import { MetricsService } from '../metrics/metrics.service';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';

@Update()
export class BotUpdate {
  private countActiveUserForDay = 0;
  constructor(
    private readonly botService: BotService,
    private readonly logger: MyLoggerService,
    private readonly metricsService: MetricsService,
    private readonly notificationService: NotificationService,
  ) {}

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
    this.botService.senderToGpt(ctx, () => this.botService.createNawChat(user, `Привет, меня зовут ${user.firstName || user.userName}`));
    await user.update({
      activeChatId: user.id,
    });
  }

  @Hears('VPN')
  async sendVpnMenu(cxt: Context) {
    await cxt.reply('Скоро. Сервис в разработке');
  }

  @On('voice')
  async sendAudio(ctx: any) {
    try {
      const user: User = ctx.state.user.user;
      const fileId = ctx?.update?.message?.voice?.file_id;
      if (user && fileId && user.activeChatId) {
        const href = (await ctx.telegram.getFileLink(ctx.update.message.voice.file_id)).toString();
        await this.botService.senderToGpt(ctx, () => {
          return this.botService.sendAudioMessage(user.activeChatId, href, user.id);
        });
      }
    } catch (e) {}
  }

  @On('message')
  async continueChat(ctx: any) {
    const user: User = ctx.state.user.user;
    if (user.activeChatId && ctx?.message?.text) {
      await this.botService.senderToGpt(ctx, () => {
        return this.botService.sendMessageToActiveChat(
          user.activeChatId,
          {
            role: RoleType.User,
            content: ctx.message.text,
          },
          user.id,
        );
      });
    } else {
      await ctx.reply('Выберети услугу', mainManu());
    }
  }
}
