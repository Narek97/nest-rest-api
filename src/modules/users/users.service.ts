import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '../../database/models';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { RoleEnum } from '../../common/enums';

@Injectable()
export class UsersService {
  constructor(readonly roleRepository: RolesService) {}
  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await User.create(dto);
    const role = await this.roleRepository.getRoleByType(RoleEnum.USER);
    await UserRole.create({
      userId: user.dataValues.id,
      roleId: role.dataValues.id,
    });
    return user;
  }

  // findAll() {
  //   return `This action returns all users`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }
  //
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  async getUserByEmail(email: string): Promise<User> {
    return User.findOne({
      where: { email },
      // include: { all: true },
    });
  }

  async getUserById(id: number): Promise<User> {
    return User.findByPk(id, {
      include: { all: true },
      attributes: { exclude: ['password'] },
    });
  }

  async verifyUser(id: number): Promise<any> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    console.log(user, 'user');
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
}
