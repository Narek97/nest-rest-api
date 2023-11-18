'use strict';

const fs = require('fs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const companyData = fs.readFileSync(
      'src/common/constants/seeders/company.json',
      {
        encoding: 'utf8',
      },
    );
    const companies = JSON.parse(companyData);
    const newCompanies = [];
    for (const company of companies.data) {
      const exists = await queryInterface.rawSelect(
        'company',
        {
          where: {
            name: company.name,
          },
        },
        ['id'],
      );
      if (exists) continue;
      newCompanies.push(company);
    }
    if (!newCompanies.length) return;

    return queryInterface.bulkInsert('company', newCompanies, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles');
  },
};
