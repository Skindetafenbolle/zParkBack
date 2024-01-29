import { Telegraf } from 'telegraf';
import { sendFeedbackToServer, sendFeedbackToChanel } from './telegramPost.js';

const telegramBotReservation = new Telegraf('6951241854:AAEN11t-rwcxfN77P0vfCaXqAcrhKpsD14Q');

const userData = {};

telegramBotReservation.command('start', (ctx) => {
  const chatId = ctx.message.chat.id;

  ctx.reply('Привет! Давайте начнем ввод данных. Введите имя родителя:');
  userData[chatId] = { step: 1, formSource: 'Telegram' };
});

telegramBotReservation.on('text', (ctx) => {
  const chatId = ctx.message.chat.id;
  const userId = ctx.message.from.id;

  if (userData[chatId]) {
    const step = userData[chatId].step;

    switch (step) {
      case 1:
        userData[chatId].name = ctx.message.text;
        userData[chatId].step = 2;
        ctx.reply('Введите дату проведения:');
        break;
      case 2:
        userData[chatId].date = ctx.message.text;
        userData[chatId].step = 3;
        ctx.reply('Введите имя именинника:');
        break;
      case 3:
        userData[chatId].name_kid = ctx.message.text;
        userData[chatId].step = 4;
        ctx.reply('Введите возраст именинника:');
        break;
      case 4:
        userData[chatId].age_kid = ctx.message.text;
        userData[chatId].step = 5;
        ctx.reply('Введите количество детей:');
        break;
      case 5:
        userData[chatId].count_kid = ctx.message.text;
        userData[chatId].step = 6;
        ctx.reply('Введите номер телефона:');
        break;
      case 6:
        userData[chatId].number = ctx.message.text;

        sendFeedbackToServer(userData[chatId]);
        sendFeedbackToChanel(userData[chatId]);

        delete userData[chatId];

        ctx.reply('Данные успешно отправлены на сервер.');
        break;
      default:
        ctx.reply('Ошибка ввода данных.');
        break;
    }
  }
});


export default telegramBotReservation;
