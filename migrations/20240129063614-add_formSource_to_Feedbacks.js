'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Feedbacks', 'formSource', {
      type: Sequelize.STRING,
      defaultValue: 'Form site',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Feedbacks', 'formSource');
  }
};
