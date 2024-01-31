import express from 'express';
import { DataTypes } from 'sequelize';
import Subscription from '../models/Subscription.js';

export function configureSubscriptionRoute() {
  const router = express.Router();

  router.post('/sendEmailSub', express.json(), async (req, res) => {
    try {
      const formData = req.body;

      if (!formData.email) {
        return res.status(400).json({ error: 'Email обязателен' });
      }

      // Проверка наличия подписки с таким же email
      const existingSubscription = await Subscription.findOne({
        where: {
          email: formData.email,
        },
      });

      if (existingSubscription) {
        return res.status(400).json({ error: 'Этот email уже подписан' });
      }

      // Создание новой подписки
      const newSubscription = await Subscription.create({
        email: formData.email,
      });

      return res.status(200).json({ success: true, subscription: newSubscription });
    } catch (error) {
      console.error(error);
      res.status(500).send('Внутренняя ошибка сервера');
    }
  });

  return router;
}
