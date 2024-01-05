import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { Initiatives, Tasks, User } from '../../database/models';
import { PaginationSearchType } from '../../common/types/base.response-type';
import { Op, Transaction } from 'sequelize';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class InitiativesService {
  constructor(
    @Inject(forwardRef(() => TasksService))
    readonly taskService: TasksService,
  ) {}

  async create(
    dto: CreateInitiativeDto,
    user: User,
    transaction: Transaction,
    sqlRowQueries: string[],
  ): Promise<Initiatives> {
    const initiative = await Initiatives.create(
      {
        ...dto,
        userId: user.id,
      },
      {
        transaction,
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    await Tasks.create(
      {
        title: initiative.name,
        description: '',
        dueDate: currentDate,
        initiativeId: initiative.id,
        userId: user.id,
      },
      {
        transaction,
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );

    return initiative;
  }

  findAll(
    args: PaginationSearchType,
    sqlRowQueries: string[],
  ): Promise<{ rows: Initiatives[]; count: number }> {
    const { offset, limit, search } = args || {};

    const where: any = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    return Initiatives.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }

  findOne(id: number, sqlRowQueries: string[]): Promise<Initiatives> {
    return Initiatives.findByPk(id, {
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }

  update(
    id: number,
    sqlRowQueries: string[],
    dto: UpdateInitiativeDto,
  ): Promise<Array<number>> {
    return Initiatives.update(
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
    return Initiatives.destroy({
      where: { id },
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }
}
