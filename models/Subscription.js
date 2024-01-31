import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConnect.js';

const Subscription = sequelize.define('Subscriptions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Уникальный email
    validate: {
      isEmail: true, // Проверка, что значение соответствует формату email
    },
  },
});

export default Subscription;
