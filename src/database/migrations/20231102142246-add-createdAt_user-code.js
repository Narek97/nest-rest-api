'use strict';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_code', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_code', 'createdAt');
  },
};
