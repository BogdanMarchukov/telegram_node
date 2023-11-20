import { User } from 'src/models/User.model';
import { Markup } from 'telegraf';

export function mainManu() {
  return {
    reply_markup: {
      keyboard: [[Markup.button.callback('GhatGpt', 'GhatGpt'), Markup.button.callback('VPN', 'VPN')]],
      resize_keyboard: true,
    },
  };
}

export function gptMainManu(user?: User) {
  const buttons = [
    Markup.button.callback('Новый чат', 'Новый чат'),
    //Markup.button.callback('Список чатов', 'Список чатов'),
    Markup.button.callback('Главное меню', 'Главное меню'),
  ];
  if (user?.isAdmin) {
    buttons.push(Markup.button.callback('Рассылка', 'Рассылка'));
  }
  return {
    reply_markup: {
      keyboard: [buttons],
      resize_keyboard: true,
    },
  };
}
