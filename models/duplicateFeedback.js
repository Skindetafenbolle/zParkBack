import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConnect.js';

const DuplicatedFeedback = sequelize.define('DuplicatedFeedback', {
  name: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.STRING,
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
    defaultValue: 1, 
  },
  monthlyCounter: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  formSource: {
    type: DataTypes.STRING,
    defaultValue: 'Site', 
  },
  
}, {
  tableName: 'DuplicatedFeedback', 
});

DuplicatedFeedback.sequelize = sequelize;

export default DuplicatedFeedback;
