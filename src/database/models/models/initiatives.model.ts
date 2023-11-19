import { BaseModel } from '../base.model';
import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'initiatives' })
export class Initiatives extends BaseModel<Initiatives, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  feedbackId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  orgId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;
}
