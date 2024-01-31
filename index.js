import express from 'express';
import cors from 'cors';
import path from 'path';
import * as url from 'url';
import { syncDatabaseModels } from './models/syncModels.js';
import { configureAdminRoutes } from './routes/adminRoutes.js';
import { configureFeedbackRoutes } from './routes/feedbackRoutes.js';
import { configureTelegramChanelRoutes } from './routes/telegramChanelroutes.js';
import { configureSubscriptionRoute } from './routes/subsRoutes.js';
import telegramBotReservation from './utils/telegramBotReservation.js'; 
import dotenv from 'dotenv';


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
app.use(express.static(path.join(__dirname, "/public")));

syncDatabaseModels();

app.use('/', configureAdminRoutes());
app.use('/', configureFeedbackRoutes());
app.use('/', configureTelegramChanelRoutes());
app.use('/', configureSubscriptionRoute());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

telegramBotReservation.launch();
