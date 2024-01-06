'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.addIndex('initiatives', ['name'], {
      name: 'snapshot_name',
    });
  },
};
