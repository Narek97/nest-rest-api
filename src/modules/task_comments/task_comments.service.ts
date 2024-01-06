import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { TaskComments, Tasks, User } from '../../database/models';

@Injectable()
export class TaskCommentsService {
  async create(
    dto: CreateTaskCommentDto,
    user: User,
    sqlRowQueries: string[],
  ): Promise<TaskComments> {
    const task = await Tasks.findByPk(dto.taskId);

    if (!task) {
      throw new NotFoundException({ message: 'Task not found' });
    }

    return TaskComments.create(
      { ...dto, userId: user.id },
      {
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );
  }
}
