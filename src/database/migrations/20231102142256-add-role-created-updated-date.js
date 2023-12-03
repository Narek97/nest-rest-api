'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roles', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
    return queryInterface.addColumn('roles', 'updatedAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roles', 'createdAt');
    return queryInterface.removeColumn('roles', 'updatedAt');
  },
};
