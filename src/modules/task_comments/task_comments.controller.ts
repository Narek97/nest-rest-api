import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { TaskCommentsService } from './task_comments.service';
import { GetUser } from '../../decorators/user.decorator';
import { User } from '../../database/models';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';

@Controller('task-comments')
@UseGuards(AuthGuard)
export class TaskCommentsController {
  constructor(private readonly taskCommentService: TaskCommentsService) {}

  @Post('/create')
  create(
    @Body() dto: CreateTaskCommentDto,
    @GetUser() user: User,
    @Req() { sqlRowQueries }: any,
  ) {
    return this.taskCommentService.create(dto, user, sqlRowQueries);
  }
}
