import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'user_accept' })
export class UserAccept extends Model<UserAccept> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  acceptId: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;
}
