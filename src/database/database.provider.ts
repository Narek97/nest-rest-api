import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';

import {
  Company,
  Organisation,
  Workspace,
  User,
  Role,
  Initiatives,
  SuperAdmin,
  UserAccept,
  Attachment,
  UserToken,
  UserRole,
  UserWorkspaces,
} from './models';

export const DB = new Sequelize(databaseConfig[process.env.NODE_ENV]);

export const databaseProviders = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    DB.addModels([
      Company,
      Organisation,
      Workspace,
      User,
      UserAccept,
      Role,
      Initiatives,
      SuperAdmin,
      Attachment,
      UserToken,
      UserRole,
      UserWorkspaces,
    ]);
    await DB.sync();
    return DB;
  },
};
