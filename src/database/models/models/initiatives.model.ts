import { BaseModel } from '../base.model';
import {
  Column,
  DataType,
  Table,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Tasks } from './tasks.model';

@Table({ tableName: 'initiatives' })
export class Initiatives extends BaseModel<Initiatives, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  workspaceId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  orgId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;

  @HasMany(() => Tasks, { foreignKey: 'initiativeId' })
  tasks: Tasks[];
}
