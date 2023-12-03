import { BelongsToMany, Column, DataType, Table } from 'sequelize-typescript';
import { RoleEnum } from '../../../common/enums';
import { BaseModel } from '../base.model';
import { User } from './user.model';

@Table({ tableName: 'roles', createdAt: false, updatedAt: false })
export class Role extends BaseModel<Role, null> {
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
