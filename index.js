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

Feedback.sync();
DuplicatedFeedback.sync();


const adminJsOptions = {
  assets: {
      styles: ["/sidebar.css"],
  },
  branding: {
    companyName: 'Zpark dashboard',
    softwareBrothers: false, 
    logo: 'https://nimble-lollipop-df2fcd.netlify.app/img/logo-removebg-cut.png',
  },
  resources: [
      {
          resource: Feedback,
          options: {
              properties: {
                  name: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  date: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  name_kid: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  count_kid: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  number: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  isOpen: { isVisible: { list: true, show: true, edit: true } },
                  formSource: { isVisible: { list: true, show: true, edit: true, filter: true } },
                  id: { isVisible: false },
              },
              actions: {
                  show: {
                      after: async (response, request, context) => {
                          const record = context.record;
                          if (record.params.isOpen === false) {
                              await record.update({ isOpen: true });
                              console.log(`Поле isOpen для записи с ID ${record.param('id')} обновлено на true`);
                          }

                          return {
                              record: record.toJSON(context.currentAdmin),
                          };
                      },
                  },
              },
              parent: {
                name: 'Zpark', // Замените на нужное вам название группы
              },
          },  
      },
      {
        resource: DuplicatedFeedback,
        options: {
          properties: {
            name: { isVisible: true },
            date: { isVisible: true },
            name_kid: { isVisible: true },
            count_kid: { isVisible: true },
            number: { isVisible: true },
            isOpen: { isVisible: true },
            formSource: { isVisible: true },
            id: { isVisible: false },
          },
          actions: {
            show: {
                after: async (response, request, context) => {
                    const record = context.record;
                    if (record.params.isOpen === false) {
                        await record.update({ isOpen: true });
                        console.log(`Поле isOpen для записи с ID ${record.param('id')} обновлено на true`);
                    }

                    return {
                        record: record.toJSON(context.currentAdmin),
                    };
                },
            },
        },
        parent: {
          name: 'Zpark', // Замените на нужное вам название группы
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

app.post('/sendFeedback', express.json(), async (req, res) => {
  try {
    const formData = req.body;

    if (!formData.name || !formData.date || !formData.name_kid || !formData.count_kid || !formData.number) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть предоставлены' });
    }

    const feedbackDate = parseISO(formData.date);

    const existingDuplicatedEntry = await DuplicatedFeedback.findOne({
      where: {
        number: formData.number,
        date: {
          [Op.gte]: startOfMonth(feedbackDate), 
        },
      },
    });

    if (existingDuplicatedEntry) {
      await existingDuplicatedEntry.update({
        counter: existingDuplicatedEntry.counter + 1,
        monthlyCounter: existingDuplicatedEntry.monthlyCounter + 1,
      });
    } else {
      const feedbackEntry = await Feedback.create({
        name: formData.name,
        date: formData.date,
        name_kid: formData.name_kid,
        count_kid: formData.count_kid,
        number: formData.number,
      });

      await feedbackEntry.update({ isOpen: false });

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

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});


app.post('/send-message', (req, res) => {
  const { count_kid, date, name, name_kid, number } = req.body;

  const text = `**Новая бронь** \nИмя: ${name}\nНомер телефона: ${number}\nКоличество детей: ${count_kid}\nИмя ребенка: ${name_kid}\nДата: ${date}`

  bot.sendMessage('-1002050314832', text);

  res.send('Message sent successfully');
});


app.use(adminJs.options.rootPath, adminRouter);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Это бот Zpark для оповещения о поступлении брони.');
});

bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  bot.sendMessage(chatId, `Вы отправили: ${text}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});