import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { AcceptService } from '../accept/accept.service';
import { User } from '../../database/models';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    readonly userService: UsersService,
    readonly acceptService: AcceptService,
    readonly mailService: MailService,
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
    await this.mailService.sendSignupVerifyEmail(user.email, activationLink);
    await this.acceptService.createUserAccept(user.id, activationLink);

    return user;
  }

  async confirmEmail(verifyId: string): Promise<any> {
    const verifyUser =
      await this.acceptService.findAndVerifyUserByAcceptId(verifyId);
    return this.userService.verifyUser(verifyUser.userId);
  }
}
