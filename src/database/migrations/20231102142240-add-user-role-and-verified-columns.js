'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'verified', {
      type: Sequelize.BOOLEAN,
      default: false,
      allowNull: true,
    });
    return queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('ADMIN', 'EDITOR', 'USER'),
      allowNull: false,
      defaultValue: 'USER',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'verified');
    return queryInterface.removeColumn('users', 'role');
  },
};
