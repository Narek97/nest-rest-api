import { Injectable } from '@nestjs/common';
import { RoleEnum } from '../../common/enums';
import { Role } from '../../database/models';

@Injectable()
export class RolesService {
  async getRoleByType(role: RoleEnum, sqlRowQueries: string[]): Promise<Role> {
    return Role.findOne({
      where: {
        role,
      },
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }
}
