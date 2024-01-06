import { BaseModel } from '../base.model';
import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { TaskComments } from './task_comments.model';

@Table({ tableName: 'task_comments_answers' })
export class TaskCommentAnswer extends BaseModel<TaskCommentAnswer, null> {
  @Column({ type: DataType.STRING, allowNull: false })
  answer: string;

  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.INTEGER })
  taskCommentId: number;

  ///////////////////////////////// Relations /////////////////////////////////
  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;

  @BelongsTo(() => TaskComments, {
    foreignKey: 'taskCommentId',
  })
  taskComments: TaskComments;
}
