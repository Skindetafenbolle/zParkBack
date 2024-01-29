// models/duplicatedFeedback.js
import { Sequelize, DataTypes } from 'sequelize';
import Feedback from './feedback.js';

const sequelize = new Sequelize('postgresql://Skindetafenbolle:LkyWGYxH8D0b@ep-odd-hat-a55kar3v.us-east-2.aws.neon.tech/zpark?sslmode=require', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});

const DuplicatedFeedback = sequelize.define('DuplicatedFeedback', {
  name: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  name_kid: {
    type: DataTypes.STRING,
  },
  count_kid: {
    type: DataTypes.INTEGER,
  },
  age_kid: {
    type: DataTypes.INTEGER,
  },
  number: {
    type: DataTypes.STRING,
  },
  isOpen: {
    type: DataTypes.BOOLEAN,
  },
  counter: {
    type: DataTypes.INTEGER,
    defaultValue: 1, // начальное значение счетчика
  },
  monthlyCounter: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  formSource: {
    type: DataTypes.STRING,
    defaultValue: 'Site', // Устанавливаем значение "Form site" по умолчанию
  },
  
}, {
  tableName: 'DuplicatedFeedback', // явно указываем имя таблицы
});

// Добавляем связь к объекту sequelize
DuplicatedFeedback.sequelize = sequelize;

export default DuplicatedFeedback;
