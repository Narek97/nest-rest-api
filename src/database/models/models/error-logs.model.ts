import { BaseModel } from '../base.model';
import {
  Column,
  DataType,
  Table,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Organisation } from './organisation.model';
import { Workspace } from './worksapace.model';
import { Role } from './role.model';

@Table({ tableName: 'error-logs', createdAt: false, updatedAt: false })
export class ErrorLogs extends BaseModel<ErrorLogs, null> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  status: string;

  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;
}
