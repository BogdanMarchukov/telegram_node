import { Markup } from 'telegraf';

export function actionActionsButton() {
  return Markup.keyboard(
    [
      Markup.button.callback('GhatGpt', 'test1'),
      Markup.button.callback('test2', 'test2'),
      Markup.button.callback('test3', 'test3'),
    ],
    {
      columns: 3,
    },
  );
}
