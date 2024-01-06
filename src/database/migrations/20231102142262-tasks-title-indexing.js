'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.addIndex('tasks', ['title'], {
      name: 'snapshot_title',
    });
  },
};
