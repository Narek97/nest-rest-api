import * as dotenv from 'dotenv';
import { ModelOptions } from 'sequelize/types/model';
import { Dialect } from 'sequelize/types/sequelize';

dotenv.config();

interface IDatabaseConfigAttributes {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number | string;
  dialect: Dialect;
  logging: typeof console.log | boolean;
  define: ModelOptions;
  acquire: number;
}

interface IDatabaseConfig {
  development: IDatabaseConfigAttributes;
  staging: IDatabaseConfigAttributes;
  production: IDatabaseConfigAttributes;
}

export const databaseConfig: IDatabaseConfig = {
  development: {
    dialect: 'mysql',
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    logging: false,
    define: { timestamps: true },
    acquire: 100 * 1000, // 100 seconds
  },
  staging: {
    dialect: 'mysql',
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    logging: console.log,
    define: { timestamps: true },
    acquire: 100 * 1000, // 100 seconds
  },
  production: {
    dialect: 'mysql',
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    logging: false,
    define: { timestamps: true },
    acquire: 100 * 1000, // 100 seconds
  },
};
