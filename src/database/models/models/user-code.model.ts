import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'user_code', createdAt: false, updatedAt: false })
export class UserCode extends Model<UserCode> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  code: string;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;
}
