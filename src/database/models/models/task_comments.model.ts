import { BaseModel } from '../base.model';
import {
  Column,
  DataType,
  Table,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Tasks } from './tasks.model';
import { TaskCommentAnswer } from './task_comment_answers.model';

@Table({ tableName: 'task_comments' })
export class TaskComments extends BaseModel<TaskComments, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  comment: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  repliesCount: 0;

  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.INTEGER })
  taskId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;

  @BelongsTo(() => Tasks, {
    foreignKey: 'taskId',
  })
  tasks: Tasks;

  @HasMany(() => TaskCommentAnswer, { foreignKey: 'taskCommentId' })
  taskCommentAnswer: TaskCommentAnswer[];
}
