import express from 'express';
import { sendMessageToChannel } from '../utils/telegramBotChanel.js';

export function configureTelegramChanelRoutes() {
  const router = express.Router();

  router.post('/sendMessage', (req, res) => {
    const { count_kid, date, name, age_kid, name_kid, number, formSource } = req.body;
    sendMessageToChannel({ count_kid, date, name, age_kid, name_kid, number, formSource });
    res.send('Message sent successfully');
  });

  return router;
}
