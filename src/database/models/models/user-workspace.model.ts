import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Workspace } from './worksapace.model';

@Table({ tableName: 'user_workspace', createdAt: false, updatedAt: false })
export class UserWorkspaces extends Model<UserWorkspaces> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  workspaceId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => Workspace, { foreignKey: 'workspaceId' })
  workspaces: Workspace;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  users: User;
}
