'use strict';

const fs = require('fs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roleData = fs.readFileSync(
      'src/common/constants/seeders/roles.json',
      {
        encoding: 'utf8',
      },
    );
    const roles = JSON.parse(roleData);
    const newRoles = [];
    for (const role of roles.data) {
      const exists = await queryInterface.rawSelect(
        'roles',
        {
          where: {
            role: role.role,
          },
        },
        ['id'],
      );
      if (exists) continue;
      newRoles.push(role);
    }
    if (!newRoles.length) return;

    return queryInterface.bulkInsert('roles', newRoles, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles');
  },
};
