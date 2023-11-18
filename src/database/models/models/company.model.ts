import { BaseModel } from '../base.model';
import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { Organisation } from './organisation.model';

@Table({ tableName: 'company' })
export class Company extends BaseModel<Company, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  ///////////////////////////////// Relations /////////////////////////////////
  @HasMany(() => Organisation, { foreignKey: 'companyId' })
  organisations: Organisation[];
}
