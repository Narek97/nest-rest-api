'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('performance-logs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      user: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      responseTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      payloadSize: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      queryCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sqlRowQueries: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('performance-logs');
  },
};
