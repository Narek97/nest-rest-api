import { BaseModel } from '../base.model';
import { Column, DataType, Table } from 'sequelize-typescript';

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
