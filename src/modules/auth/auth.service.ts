import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { AcceptService } from '../accept/accept.service';
import { User } from '../../database/models';

@Injectable()
export class AuthService {
  constructor(
    readonly userService: UsersService,
    readonly acceptService: AcceptService,
  ) {}
  async registration(dto: CreateUserDto): Promise<User> {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(
        { message: ['user already exist'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({
      ...dto,
      password: hashPassword,
    });
    const activationLink = uuid();
    await this.acceptService.createUserAccept(user.id, activationLink);
    return user;
  }
}
