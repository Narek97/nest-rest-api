import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Role } from './role.model';

@Table({ tableName: 'user_role', createdAt: false, updatedAt: false })
export class UserRole extends Model<UserRole> {
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
  roleId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => Role, { foreignKey: 'roleId' })
  role: Role;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  users: User;
}
