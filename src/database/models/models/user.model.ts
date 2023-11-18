import { BaseModel } from '../base.model';
import {
  Column,
  DataType,
  Table,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Organisation } from './organisation.model';
import { Workspace } from './worksapace.model';

@Table({ tableName: 'users' })
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

  @Column({ type: DataType.NUMBER })
  orgId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => Organisation, {
    foreignKey: 'orgId',
  })
  organisation: Organisation;

  @BelongsToMany(() => Workspace, 'UserWorkspaces', 'userId', 'workspaceId')
  workspaces: Workspace;
}
