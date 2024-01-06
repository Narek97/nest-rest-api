import { Module } from '@nestjs/common';
import { TaskCommentsController } from './task_comments.controller';
import { TaskCommentsService } from './task_comments.service';

@Module({
  controllers: [TaskCommentsController],
  providers: [TaskCommentsService],
  exports: [TaskCommentsService],
})
export class TaskCommentsModule {}
