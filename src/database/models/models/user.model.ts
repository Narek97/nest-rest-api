import { BaseModel } from '../base.model';
import {
  Column,
  DataType,
  Table,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Organisation } from './organisation.model';
import { Workspace } from './worksapace.model';
import { Role } from './role.model';
import { Tasks } from './tasks.model';
import { TaskComments } from './task_comments.model';

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends BaseModel<User, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  avatar: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  verified: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isTwoFactorEnable: boolean;

  @Column({ type: DataType.INTEGER })
  orgId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => Organisation, {
    foreignKey: 'orgId',
  })
  organisation: Organisation;

  @HasMany(() => Tasks, { foreignKey: 'userId' })
  tasks: Tasks[];

  @HasMany(() => TaskComments, { foreignKey: 'userId' })
  taskComments: TaskComments[];

  @BelongsToMany(() => Workspace, 'user_workspace', 'userId', 'workspaceId')
  workspaces: Workspace[];

  @BelongsToMany(() => Role, 'user_role', 'userId', 'roleId')
  roles: Role[];
}
