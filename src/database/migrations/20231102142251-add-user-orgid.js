'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'orgId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'organisations',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'orgId');
  },
};
