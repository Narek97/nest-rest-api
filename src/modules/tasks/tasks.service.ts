import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks, User } from '../../database/models';
import { InitiativesService } from '../initiatives/initiatives.service';
import { Transaction } from 'sequelize';

@Injectable()
export class TasksService {
  constructor(
    @Inject(forwardRef(() => InitiativesService))
    readonly initiativeService: InitiativesService,
  ) {}

  async create(
    dto: CreateTaskDto,
    user: User,
    sqlRowQueries: string[],
  ): Promise<Tasks> {
    const initiative = await this.initiativeService.findOne(
      dto.initiativeId,
      sqlRowQueries,
    );

    if (!initiative) {
      throw new NotFoundException({ message: 'initiative not found' });
    }

    return Tasks.create(
      {
        ...dto,
        userId: user.id,
      },
      {
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );
  }

  findAll(sqlRowQueries: string[]): Promise<Array<Tasks>> {
    return Tasks.findAll({
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }

  findOne(id: number, sqlRowQueries: string[]): Promise<Tasks> {
    return Tasks.findByPk(id, {
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }

  update(id: number, dto: UpdateTaskDto, sqlRowQueries: string[]) {
    return Tasks.update(
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

  remove(id: number, sqlRowQueries: string[]): Promise<number> {
    return Tasks.destroy({
      where: { id },
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }
}
