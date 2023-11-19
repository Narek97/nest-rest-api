import { BaseModel } from '../base.model';
import { Column, DataType, Table } from 'sequelize-typescript';
import { SuperAdminEnum } from '../../../common/enums';

@Table({ tableName: 'super-admin' })
export class SuperAdmin extends BaseModel<SuperAdmin, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  avatar: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: SuperAdminEnum.SUPER_ADMIN,
  })
  role: string;
}
