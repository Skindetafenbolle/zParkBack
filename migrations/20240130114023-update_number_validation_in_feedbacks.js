'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Feedbacks', 'number', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: /^[\d\+\-\(\) ]+$/,  // новая валидация для строки номера
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Может потребоваться определенный код отката, в зависимости от ваших потребностей
  },
};
