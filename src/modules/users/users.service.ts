import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Role, User, UserRole } from '../../database/models';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { RoleEnum } from '../../common/enums';
import { UpdateUserTwoFactorVerification } from './dto/update-user.dto';
import { BaseMessageResponseType } from '../../common/types/base.response-type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    readonly roleService: RolesService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createUser(dto: CreateUserDto, sqlRowQueries: string[]): Promise<User> {
    try {
      const user = await User.create(dto, {
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      });
      const role = await this.roleService.getRoleByType(
        RoleEnum.USER,
        sqlRowQueries,
      );
      await UserRole.create(
        {
          userId: user.dataValues.id,
          roleId: role.dataValues.id,
        },
        {
          logging: (sql) => {
            sqlRowQueries.push(sql);
          },
        },
      );
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async getUserByEmail(email: string, sqlRowQueries: string[]): Promise<User> {
    return User.findOne({
      where: { email },
      include: { model: Role },
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
  }

  async getUserById(id: number, sqlRowQueries: string[]): Promise<User> {
    await this.cacheManager.set('user', { key: 'hello world' });

    const user = await User.findByPk(id, {
      include: {
        model: Role,
        attributes: {
          exclude: [],
        },
      },
      attributes: { exclude: ['password'] },
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });

    if (user) {
      return user;
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  async verifyUser(id: number, sqlRowQueries: string[]): Promise<any> {
    const user = await this.getUserById(id, sqlRowQueries);
    if (!user) {
      throw new NotFoundException({ message: 'user not found' });
    }
    return User.update(
      {
        verified: true,
      },
      {
        where: {
          id: user.id,
        },
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );
  }

  async getMe(id: number, sqlRowQueries: string[]): Promise<User> {
    const cacheItem = await this.cacheManager.get('user');
    const cacheItem1 = await this.cacheManager.get('test');
    console.log(cacheItem, 'cacheItem');
    console.log(cacheItem1, 'cacheItem1');

    return await this.getUserById(id, sqlRowQueries);
  }

  async toggleTwoFactorVerification(
    user: User,
    dto: UpdateUserTwoFactorVerification,
    sqlRowQueries: string[],
  ): Promise<BaseMessageResponseType> {
    await User.update(
      { isTwoFactorEnable: dto.isEnable },
      {
        where: {
          id: user.id,
        },
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );

    return { message: 'User updated successfully' };
  }
}
