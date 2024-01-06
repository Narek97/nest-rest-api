import { BaseModel } from '../base.model';
import {
  Column,
  DataType,
  Table,
  BelongsTo,
  HasMany,
  AfterUpdate,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Initiatives } from './initiatives.model';
import { TaskComments } from './task_comments.model';

@Table({ tableName: 'tasks' })
export class Tasks extends BaseModel<Tasks, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.DATE })
  dueDate: Date;

  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.INTEGER })
  initiativeId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;

  @BelongsTo(() => Initiatives, {
    foreignKey: 'initiativeId',
  })
  initiatives: Initiatives;

  @HasMany(() => TaskComments, { foreignKey: 'taskId' })
  tasksComments: TaskComments[];
}
