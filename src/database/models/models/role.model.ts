import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { RoleEnum } from '../../../common/enums';

@Table({ tableName: 'roles', createdAt: false, updatedAt: false })
export class Role extends Model<Role> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM(...Object.values(RoleEnum)),
    allowNull: false,
    defaultValue: RoleEnum.USER,
  })
  role: RoleEnum;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsToMany(() => User, 'user_role', 'roleId', 'userId')
  users: User[];
}
