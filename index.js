import express from 'express';
import AdminJS from 'adminjs';
import AdminJSSequelize from '@adminjs/sequelize';
import AdminJSExpress from '@adminjs/express';
import cors from 'cors';
import path from 'path';
import * as url from 'url'
import { Op } from 'sequelize';

import TelegramBot from 'node-telegram-bot-api';
import json from 'body-parser';


import { startOfMonth, isAfter, parseISO } from 'date-fns';


import Feedback from './models/feedback.js';
import DuplicatedFeedback from './models/duplicateFeedback.js';



const token = '6344216602:AAEbhHaZMvlpWOu22z0lVxP-Lmm5F7P2kOw';
const bot = new TelegramBot(token, {polling: true});
const app = express();
app.use(json()); 
app.use(cors());

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
app.use(express.static(path.join(__dirname + "/public")));
// Синхронизация модели с базой данных
Feedback.sync();
DuplicatedFeedback.sync();


const adminJsOptions = {
  assets: {
      styles: ["/sidebar.css"],
  },
  resources: [
      {
          resource: Feedback,
          options: {
              properties: {
                  // Указываем поля, которые должны отображаться в административной панели
                  name: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  date: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  name_kid: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  count_kid: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  number: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  isOpen: { isVisible: { list: true, show: true, edit: true } },
                  formSource: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  // Исключаем поле id
                  id: { isVisible: false },
              },
              actions: {
                  show: {
                      // Хук, выполняемый после открытия записи
                      after: async (response, request, context) => {
                          // Выполняем обновление поля isOpen на true, только если изначально оно false
                          const record = context.record;
                          if (record.params.isOpen === false) {
                              await record.update({ isOpen: true });
                              console.log(`Поле isOpen для записи с ID ${record.param('id')} обновлено на true`);
                          }

                          // Возвращаем объект RecordJSON
                          return {
                              record: record.toJSON(context.currentAdmin),
                          };
                      },
                  },
              },
          },  
      },
      {
        resource: DuplicatedFeedback,
        options: {
          properties: {
            // Указываете поля, которые должны отображаться в административной панели
            name: { isVisible: true },
            date: { isVisible: true },
            name_kid: { isVisible: true },
            count_kid: { isVisible: true },
            number: { isVisible: true },
            isOpen: { isVisible: true },
            formSource: { isVisible: true },
            // Исключаете поле id
            id: { isVisible: false },
          },
          actions: {
            show: {
                // Хук, выполняемый после открытия записи
                after: async (response, request, context) => {
                    // Выполняем обновление поля isOpen на true, только если изначально оно false
                    const record = context.record;
                    if (record.params.isOpen === false) {
                        await record.update({ isOpen: true });
                        console.log(`Поле isOpen для записи с ID ${record.param('id')} обновлено на true`);
                    }

                    // Возвращаем объект RecordJSON
                    return {
                        record: record.toJSON(context.currentAdmin),
                    };
                },
            },
        },
        },
      },
  ],
  rootPath: '/admin',
};



AdminJS.registerAdapter(AdminJSSequelize);
const adminJs = new AdminJS(adminJsOptions);
const adminRouter = AdminJSExpress.buildRouter(adminJs);

app.get('/test', (req, res) => {
  res.send('jejejje').status(200);
});

// Роут для обработки данных из формы
app.post('/sendFeedback', express.json(), async (req, res) => {
  try {
    const formData = req.body;

    // Проверьте наличие всех обязательных полей в данных из формы
    if (!formData.name || !formData.date || !formData.name_kid || !formData.count_kid || !formData.number) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть предоставлены' });
    }

    // Преобразуем дату из формы в объект Date
    const feedbackDate = parseISO(formData.date);

    // Ищем запись в DuplicatedFeedback по номеру и дате за текущий месяц
    const existingDuplicatedEntry = await DuplicatedFeedback.findOne({
      where: {
        number: formData.number,
        date: {
          [Op.gte]: startOfMonth(feedbackDate), // только записи за текущий месяц
        },
      },
    });

    if (existingDuplicatedEntry) {
      // Если запись уже существует, увеличиваем значения счетчиков
      await existingDuplicatedEntry.update({
        counter: existingDuplicatedEntry.counter + 1,
        monthlyCounter: existingDuplicatedEntry.monthlyCounter + 1,
      });
    } else {
      // Если записи нет, создаем новую запись в Feedback
      const feedbackEntry = await Feedback.create({
        name: formData.name,
        date: formData.date,
        name_kid: formData.name_kid,
        count_kid: formData.count_kid,
        number: formData.number,
      });

      // Устанавливаем isOpen в false при создании новой записи
      await feedbackEntry.update({ isOpen: false });

      // Создаем новую запись в DuplicatedFeedback
      await DuplicatedFeedback.create({
        name: formData.name,
        date: formData.date,
        name_kid: formData.name_kid,
        count_kid: formData.count_kid,
        number: formData.number,
        isOpen: false,
        counter: 1,
        monthlyCounter: 1,
      });
    }

    // Отправляем успешный ответ клиенту
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});


app.post('/send-message', (req, res) => {
  const { count_kid, date, name, name_kid, number } = req.body;

  // Создаем текстовое сообщение
  const text = `**Новая бронь** \nИмя: ${name}\nНомер телефона: ${number}\nКоличество детей: ${count_kid}\nИмя ребенка: ${name_kid}\nДата: ${date}`

  // Отправляем сообщение в чат с ботом
  bot.sendMessage('-1002050314832', text); // Замените 'YOUR_CHAT_ID' на реальный ID вашего чата с ботом

  // Отправляем ответ об успешном выполнении запроса
  res.send('Message sent successfully');
});


// Используйте административную панель AdminJS
app.use(adminJs.options.rootPath, adminRouter);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Это бот Zpark для оповещения о поступлении брони.');
});

// Обработчик текстовых сообщений
bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  bot.sendMessage(chatId, `Вы отправили: ${text}`);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});