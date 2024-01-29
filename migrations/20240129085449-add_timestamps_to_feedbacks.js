'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Feedbacks', 'createdAt', {
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('Feedbacks', 'updatedAt', {
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Feedbacks', 'createdAt');
    await queryInterface.removeColumn('Feedbacks', 'updatedAt');
  },
};
