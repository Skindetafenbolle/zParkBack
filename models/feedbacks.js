'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedbacks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Feedbacks.init({
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    name_kid: DataTypes.STRING,
    count_kid: DataTypes.INTEGER,
    number: DataTypes.STRING,
    isOpen: DataTypes.BOOLEAN,
    formSource: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Feedbacks',
  });
  return Feedbacks;
};