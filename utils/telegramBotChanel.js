import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TOKEN_CHANEL;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Это бот Zpark для оповещения о поступлении брони.');
});

export function sendMessageToChannel({ count_kid, date, name, age_kid, name_kid, number, formSource }) {
  const text = `**Новая бронь** \nИмя: ${name}\nНомер телефона: ${number}\nКоличество детей: ${count_kid}\nИмя ребенка: ${name_kid}\nВозраст ребенка: ${age_kid}\nДата: ${date}\nЗабронировано: ${formSource}`;
  bot.sendMessage('-1002050314832', text);
}
