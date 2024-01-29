// migrations/xxxxxx-update-duplicated-feedback-date.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('DuplicatedFeedback', 'date', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Вернуть изменения в обратном направлении, если это необходимо
    // Например, если изначально поле было типа DATE, можно вернуть его к DATE
    await queryInterface.changeColumn('DuplicatedFeedback', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
