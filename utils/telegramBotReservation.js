import { Telegraf } from 'telegraf';
import { sendFeedbackToServer, sendFeedbackToChanel } from './telegramPost.js';
import dotenv from 'dotenv';
import { parse, format, isBefore } from 'date-fns';

dotenv.config();

const token = process.env.TELEGRAM_RESERVATION;
const telegramBotReservation = new Telegraf(token);

const userData = {};

function parseCustomDate(dateString) {
  const parsedDate = parse(dateString, 'dd.MM.yyyy', new Date());
  return parsedDate;
}

telegramBotReservation.command('start', (ctx) => {
  const chatId = ctx.message.chat.id;

  ctx.reply('Привет! Давайте начнем ввод данных. Введите имя родителя:');
  userData[chatId] = { step: 1, formSource: 'Telegram' };
});

telegramBotReservation.on('text', (ctx) => {
  const chatId = ctx.message.chat.id;

  if (userData[chatId]) {
    const step = userData[chatId].step;
    const inputText = ctx.message.text.trim();

    // Проверка наличия цифр в поле имени
    if (step === 1 || step === 3) {
      if (/\d/.test(inputText)) {
        ctx.reply('Имя не может содержать цифры. Пожалуйста, введите правильное имя:');
        return;
      }
    }

    switch (step) {
      case 1:
        if (inputText === '') {
          ctx.reply('Имя не может быть пустым. Пожалуйста, введите имя родителя:');
        } else {
          userData[chatId].name = inputText;
          userData[chatId].step = 2;
          ctx.reply('Введите дату проведения (в формате день.месяц.год):');
        }
        break;
      case 2:
        const customDate = parseCustomDate(inputText);
        if (!isValidCustomDate(customDate)) {
          ctx.reply('Неверный формат даты или дата уже прошла. Пожалуйста, введите будущую дату (в формате день.месяц.год):');
        } else {
          userData[chatId].date = format(customDate, 'yyyy-MM-dd', { timeZone: 'Europe/Minsk' });
          userData[chatId].step = 3;
          ctx.reply('Введите имя именинника:');
        }
        break;
      case 3:
        if (inputText === '') {
          ctx.reply('Имя именинника не может быть пустым. Пожалуйста, введите имя именинника:');
        } else {
          // Проверка наличия цифр в поле именинника
          if (/\d/.test(inputText)) {
            ctx.reply('Имя именинника не может содержать цифры. Пожалуйста, введите правильное имя:');
            return;
          }
          userData[chatId].name_kid = inputText;
          userData[chatId].step = 4;
          ctx.reply('Введите cколько лет исполняется:');
        }
        break;
      case 4:
        if (!isValidAge(inputText)) {
          ctx.reply('Неверный формат возраста. Введите корректный возраст (от 0 до 17 лет):');
        } else {
          userData[chatId].age_kid = inputText;
          userData[chatId].step = 5;
          ctx.reply('Введите количество детей:');
        }
        break;
      case 5:
        if (!isValidNumber(inputText)) {
          ctx.reply('Неверный формат количества детей. Введите число в правильном формате:');
        } else {
          userData[chatId].count_kid = inputText;
          userData[chatId].step = 6;
          ctx.reply('Введите номер телефона (+375XXXXXXXXX):');
        }
        break;
      case 6:
        if (!isValidPhoneNumber(inputText)) {
          ctx.reply('Неверный формат номера телефона. Введите номер в правильном формате+375XXXXXXXXX:');
        } else {
          userData[chatId].number = inputText;

          sendFeedbackToServer(userData[chatId]);
          sendFeedbackToChanel(userData[chatId]);

          delete userData[chatId];

          ctx.reply('Данные успешно отправлены на сервер.');
        }
        break;
      default:
        ctx.reply('Ошибка ввода данных.');
        break;
    }
  }
});

function isValidAge(ageString) {
  const age = parseInt(ageString, 10);
  return !isNaN(age) && age >= 0 && age <= 17;
}

function isValidPhoneNumber(phoneNumber) {
  return /^\+375\d{9}$/.test(phoneNumber);
}

function isValidCustomDate(date) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  
  const parsedDateInLocalTime = new Date(
    Date.UTC(currentYear, currentMonth, currentDay, 0, 0, 0, 0) + date.getTimezoneOffset() * 60000
  );

  return date && isBefore(parsedDateInLocalTime, date);
}


function isValidNumber(numberString) {
  return /^\d+$/.test(numberString);
}

export default telegramBotReservation;
