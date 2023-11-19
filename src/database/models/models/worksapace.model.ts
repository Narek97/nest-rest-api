import { BaseModel } from '../base.model';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { Organisation } from './organisation.model';
import { User } from './user.model';

@Table({ tableName: 'workspaces' })
export class Workspace extends BaseModel<Workspace, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  orgId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => Organisation, { foreignKey: 'orgId' })
  organisation: Organisation;

  @BelongsToMany(() => User, 'user_workspace', 'workspaceId', 'userId')
  users: User;
}
