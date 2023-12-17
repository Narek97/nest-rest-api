import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role, User, UserRole } from '../../database/models';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { RoleEnum } from '../../common/enums';
import { UpdateUserTwoFactorVerification } from './dto/update-user.dto';
import { BaseMessageResponseType } from '../../common/types/base.response-type';

@Injectable()
export class UsersService {
  constructor(readonly roleService: RolesService) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const user = await User.create(dto);
      const role = await this.roleService.getRoleByType(RoleEnum.USER);
      await UserRole.create({
        userId: user.dataValues.id,
        roleId: role.dataValues.id,
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    return User.findOne({
      where: { email },
      include: { model: Role },
    });
  }

  async getUserById(id: number): Promise<User> {
    return User.findByPk(id, {
      include: {
        model: Role,
        attributes: {
          exclude: [],
        },
      },
      attributes: { exclude: ['password'] },
    });
  }

  async verifyUser(id: number): Promise<any> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return User.update(
      {
        verified: true,
      },
      {
        where: {
          id: user.id,
        },
      },
    );
  }

  async getMe(id: number): Promise<User> {
    return this.getUserById(id);
  }

  async toggleTwoFactorVerification(
    user: User,
    dto: UpdateUserTwoFactorVerification,
  ): Promise<BaseMessageResponseType> {
    User.update(
      { isTwoFactorEnable: dto.isEnable },
      {
        where: {
          id: user.id,
        },
      },
    );

    return { message: 'User updated successfully' };
  }
}
