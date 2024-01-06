import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/user.decorator';
import { User } from '../../database/models';
import { TaskCommentAnswersService } from './task_comment_answers.service';
import { CreateTaskCommentAnswerDto } from './dto/create-task-comment-answer.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';

@Controller('task-comment-answers')
@UseGuards(AuthGuard)
export class TaskCommentAnswersController {
  constructor(
    private readonly taskCommentAnswersService: TaskCommentAnswersService,
  ) {}

  @Post('/create')
  create(
    @Body() dto: CreateTaskCommentAnswerDto,
    @GetUser() user: User,
    @Req() { sqlRowQueries }: any,
  ) {
    return this.taskCommentAnswersService.create(dto, user, sqlRowQueries);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateTaskCommentAnswerDto,
    @Req() { sqlRowQueries }: any,
  ) {
    return this.taskCommentAnswersService.update(+id, dto, sqlRowQueries);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() { sqlRowQueries }: any) {
    return this.taskCommentAnswersService.remove(+id, sqlRowQueries);
  }
}
