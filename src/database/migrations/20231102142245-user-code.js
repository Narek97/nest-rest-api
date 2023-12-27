'use strict';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('user_code', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('user_code');
  },
};
