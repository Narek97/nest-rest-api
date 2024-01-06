import { Module } from '@nestjs/common';
import { TaskCommentAnswersController } from './task_comment_answers.controller';
import { TaskCommentAnswersService } from './task_comment_answers.service';

@Module({
  controllers: [TaskCommentAnswersController],
  providers: [TaskCommentAnswersService]
})
export class TaskCommentAnswersModule {}
