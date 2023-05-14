import { Markup } from 'telegraf';

export function mainManu() {
  return {
    reply_markup: {
      keyboard: [
        [
          Markup.button.callback('GhatGpt', 'GhatGpt'),
          Markup.button.callback('VPN', 'VPN'),
        ],
      ],
      resize_keyboard: true,
    },
  };
}

export function gptMainManu() {
  return {
    reply_markup: {
      keyboard: [
        [
          Markup.button.callback('Новый чат', 'Новый чат'),
          Markup.button.callback('Список чатов', 'Список чатов'),
          Markup.button.callback('Главное меню', 'Главное меню'),
        ],
      ],
      resize_keyboard: true,
    },
  };
}
