import { Markup } from 'telegraf';

export function mainManu() {
  return Markup.keyboard(
    [
      Markup.button.callback('GhatGpt', 'GhatGpt'),
      Markup.button.callback('VPN', 'VPN'),
    ],
    {
      columns: 3,
    },
  );
}

export function gptMainManu() {
  return Markup.keyboard(
    [
      Markup.button.callback('Новый чат', 'Новый чат'),
      Markup.button.callback('Список чатов', 'Список чатов'),
      Markup.button.callback('Главное меню', 'Главное меню'),
    ],
    {
      columns: 3,
    },
  );
}
