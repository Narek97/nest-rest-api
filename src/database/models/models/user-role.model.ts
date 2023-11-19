import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'user_role' })
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
}
