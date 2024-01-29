// feedbackModel.js
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('postgresql://Skindetafenbolle:LkyWGYxH8D0b@ep-odd-hat-a55kar3v.us-east-2.aws.neon.tech/zpark?sslmode=require', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});

const Feedback = sequelize.define('Feedbacks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  name_kid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  count_kid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\+[0-9]+$/,
    },
  },
  isOpen: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, 
  },
  formSource: {
    type: DataTypes.STRING,
    defaultValue: 'Form site', // Устанавливаем значение "Form site" по умолчанию
  },
}, {
  timestamps: false,
});

export default Feedback;
