// migrations/xxxxxx-update-feedback-date.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Feedbacks', 'date', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Вернуть изменения в обратном направлении, если это необходимо
    // Например, если изначально поле было типа DATE, можно вернуть его к DATE
    await queryInterface.changeColumn('Feedbacks', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
