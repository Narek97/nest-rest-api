// eslint-disable-next-line @typescript-eslint/no-var-requires
// require('dotenv').config({ path: `.env.development` });
require('dotenv').config();

const databaseConfig = {
  development: {
    dialect: process.env.DIALECT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    autoLoadModels: true,
    synchronize: false,
  },
  test: {
    dialect: process.env.DIALECT || 'mysql',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root2022',
    database: process.env.MYSQL_DATABASE || 'nest-course_test',
    autoLoadModels: true,
    synchronize: false,
  },
  production: {
    dialect: process.env.DIALECT || 'mysql',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root2022',
    database: process.env.MYSQL_DATABASE || 'nest-course-prod',
    autoLoadModels: true,
    synchronize: false,
  },
};

module.exports = databaseConfig;
