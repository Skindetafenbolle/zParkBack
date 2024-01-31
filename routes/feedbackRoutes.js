import express from 'express';
import { Op } from 'sequelize';
import { startOfMonth, parseISO } from 'date-fns';
import Feedback from '../models/feedback.js';
import DuplicatedFeedback from '../models/duplicateFeedback.js';
import notifier from 'node-notifier'

export function configureFeedbackRoutes() {
  const router = express.Router();

  router.post('/sendFeedback', express.json(), async (req, res) => {
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
            age_kid: formData.age_kid,
            count_kid: formData.count_kid,
            number: formData.number,
            formSource: formData.formSource,
          });
    
          await feedbackEntry.update({ isOpen: false });
    
          await DuplicatedFeedback.create({
            name: formData.name,
            date: formData.date,
            name_kid: formData.name_kid,
            age_kid: formData.age_kid,
            count_kid: formData.count_kid,
            number: formData.number,
            isOpen: false,
            counter: 1,
            monthlyCounter: 1,
            formSource: formData.formSource,
          });
        }
        
        notifier.notify({
          title: 'Новая заявка',
          message: `Имя: ${formData.name}, Дата: ${formData.date}, Имя ребенка: ${formData.name_kid}, Возраст ребенка: ${formData.age_kid}, Количество детей: ${formData.count_kid}, Номер телефона: ${formData.number}, Источник: ${formData.formSource}`,
          sound: true,
          wait: true,
        });

        res.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        res.status(500).send('Внутренняя ошибка сервера');
      }
  });

  return router;
}
