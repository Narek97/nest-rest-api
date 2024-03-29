import { BaseModel } from '../base.model';
import {
  Column,
  DataType,
  Table,
  BelongsTo,
  AfterCreate,
  AfterBulkUpdate,
  AfterBulkDestroy,
} from 'sequelize-typescript';
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

  // triggers

  @AfterCreate
  static async AfterCreate(instance: TaskCommentAnswer) {
    console.log(instance, 'in');
    const taskComment = await TaskComments.findByPk(instance.taskCommentId);
    if (taskComment) {
      taskComment.repliesCount += 1;
      await taskComment.save();
    }
  }

  @AfterBulkUpdate
  static async AfterUpdate(instance: TaskCommentAnswer) {
    console.log(`User with id ${instance} has been updated`);
    // Add your custom logic here
  }

  // @BeforeUpdate
  // static async BeforeUpdate(instance: TaskCommentAnswer) {
  //   console.log(`User with id ${instance.id} has been updated`);
  //   // Add your custom logic here
  // }
  //
  @AfterBulkDestroy
  static async AfterDestroy(instance: TaskCommentAnswer, aa: any) {
    console.log(aa, 'de');

    const taskComment = await TaskComments.findByPk(instance.taskCommentId);
    if (taskComment) {
      taskComment.repliesCount -= 1;
      await taskComment.save();
    }
  }

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
