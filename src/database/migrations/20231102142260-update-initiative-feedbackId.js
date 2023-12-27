'use strict';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('initiatives', 'feedbackId');
    await queryInterface.addColumn('initiatives', 'workspaceId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('initiatives', 'feedbackId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.removeColumn('initiatives', 'workspaceId');
  },
};
