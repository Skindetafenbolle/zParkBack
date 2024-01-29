import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConnect.js';

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
    type: DataTypes.STRING,
    allowNull: false,
  },
  name_kid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age_kid: {
    type: DataTypes.INTEGER,
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
    defaultValue: 'Site',
  },
});

export default Feedback;
