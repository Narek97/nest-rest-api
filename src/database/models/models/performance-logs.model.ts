import { BaseModel } from '../base.model';
import { Column, DataType, Table } from 'sequelize-typescript';

@Table({ tableName: 'performance-logs', createdAt: false, updatedAt: false })
export class PerformanceLogs extends BaseModel<PerformanceLogs, null> {
  @Column({ type: DataType.JSON, allowNull: false })
  user: JSON;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @Column({ type: DataType.STRING, allowNull: false })
  method: string;

  @Column({ type: DataType.NUMBER, allowNull: false })
  responseTime: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  payloadSize: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  queryCount: number;

  @Column({ type: DataType.JSON, allowNull: false })
  sqlRowQueries: JSON;
}
