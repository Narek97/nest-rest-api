'use strict';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role');
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'role', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
