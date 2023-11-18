'use strict';

const fs = require('fs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const orgData = fs.readFileSync(
      'src/common/constants/seeders/organisations.json',
      {
        encoding: 'utf8',
      },
    );
    const orgs = JSON.parse(orgData);
    const newOrgs = [];
    for (const org of orgs.data) {
      const exists = await queryInterface.rawSelect(
        'organisations',
        {
          where: {
            name: org.name,
          },
        },
        ['id'],
      );
      if (exists) continue;
      newOrgs.push({ ...org, companyId: 1 });
    }
    if (!newOrgs.length) return;
    return queryInterface.bulkInsert('organisations', newOrgs, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('organisations');
  },
};
