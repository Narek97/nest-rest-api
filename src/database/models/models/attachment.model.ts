import { BaseModel } from '../base.model';
import { Column, DataType, Table } from 'sequelize-typescript';

@Table({ tableName: 'attachment' })
export class Attachment extends BaseModel<Attachment, null> {
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.INTEGER })
  relatedId: number;

  @Column({ type: DataType.STRING })
  folder: string;

  @Column({ type: DataType.STRING })
  url: string;

  @Column({ type: DataType.STRING })
  key: string;
}
