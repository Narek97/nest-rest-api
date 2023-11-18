import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';

import {
  Company,
  Organisation,
  User,
  Workspace,
  UserWorkspaces,
} from './models';

export const DB = new Sequelize(databaseConfig[process.env.NODE_ENV]);

export const databaseProviders = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    DB.addModels([Company, Organisation, User, Workspace, UserWorkspaces]);
    await DB.sync();
    return DB;
  },
};
