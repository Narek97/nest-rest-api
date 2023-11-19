import { BaseModel } from '../base.model';
import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Company } from './company.model';
import { User } from './user.model';
import { Workspace } from './worksapace.model';

@Table({ tableName: 'organisations' })
export class Organisation extends BaseModel<Organisation, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => Company, { foreignKey: 'companyId' })
  company: Company;

  @HasMany(() => User, { foreignKey: 'orgId' })
  users: User[];

  @HasMany(() => Workspace, { foreignKey: 'orgId' })
  workspaces: Workspace[];
}
