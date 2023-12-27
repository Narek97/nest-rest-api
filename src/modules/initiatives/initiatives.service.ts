import { Injectable } from '@nestjs/common';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { Initiatives, User } from '../../database/models';
import { PaginationSearchType } from '../../common/types/base.response-type';
import { Op } from 'sequelize';

@Injectable()
export class InitiativesService {
  create(
    dto: CreateInitiativeDto,
    user: User,
    sqlRowQueries: string[],
  ): Promise<Initiatives> {
    return Initiatives.create(
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
