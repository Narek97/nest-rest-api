import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskCommentAnswerDto } from './dto/create-task-comment-answer.dto';
import { TaskCommentAnswer, TaskComments, User } from '../../database/models';

@Injectable()
export class TaskCommentAnswersService {
  async create(
    dto: CreateTaskCommentAnswerDto,
    user: User,
    sqlRowQueries: string[],
  ) {
    const taskComment = await TaskComments.findByPk(dto.taskCommentId);

    if (!taskComment) {
      throw new NotFoundException({ message: 'Task comment not found' });
    }

    return TaskCommentAnswer.create(
      { ...dto, userId: user.id },
      {
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );
  }

  async update(
    id: number,
    dto: CreateTaskCommentAnswerDto,
    sqlRowQueries: string[],
  ) {
    const taskCommentAnswer = await TaskCommentAnswer.findByPk(id);

    if (!taskCommentAnswer) {
      throw new NotFoundException({ message: 'Task comment answer not found' });
    }

    return TaskCommentAnswer.update(
      {
        ...dto,
      },
      {
        where: { id },
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );
  }

  async remove(id: number, sqlRowQueries: string[]): Promise<number> {
    const taskCommentAnswer = await TaskCommentAnswer.findByPk(id);

    if (!taskCommentAnswer) {
      throw new NotFoundException({ message: 'Task comment answer not found' });
    }

    return TaskCommentAnswer.destroy({
      where: { id },
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }
}
