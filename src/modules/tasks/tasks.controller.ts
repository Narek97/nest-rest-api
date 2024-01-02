import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/user.decorator';
import { User } from '../../database/models';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/create')
  create(
    @Body() dto: CreateTaskDto,
    @GetUser() user: User,
    @Req() { sqlRowQueries }: any,
  ) {
    return this.tasksService.create(dto, user, sqlRowQueries);
  }

  @Get('/get-all')
  findAll(@Req() { sqlRowQueries }: any) {
    return this.tasksService.findAll(sqlRowQueries);
  }

  @Get('get/:id')
  findOne(@Param('id') id: string, @Req() { sqlRowQueries }: any) {
    return this.tasksService.findOne(+id, sqlRowQueries);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() { sqlRowQueries }: any,
  ) {
    return this.tasksService.update(+id, dto, sqlRowQueries);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() { sqlRowQueries }: any) {
    return this.tasksService.remove(+id, sqlRowQueries);
  }
}
