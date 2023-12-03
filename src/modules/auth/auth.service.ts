import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { AcceptService } from '../accept/accept.service';
import { User, UserToken } from '../../database/models';
import { MailService } from '../mail/mail.service';
import { loginUserDto } from '../users/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserResponse } from './types';

@Injectable()
export class AuthService {
  constructor(
    readonly userService: UsersService,
    readonly acceptService: AcceptService,
    readonly mailService: MailService,
    readonly jwtService: JwtService,
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

  async login(dto: loginUserDto): Promise<LoginUserResponse> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'incorrect email or password',
      });
    }
    if (user.verified) {
      const passwordEquals = await bcrypt.compare(dto.password, user.password);
      if (!passwordEquals) {
        throw new UnauthorizedException({
          message: 'incorrect email or password',
        });
      }
      const { accessToken, refreshToken } = await this.generateToken(user);
      await this.saveToken(user.id, refreshToken);
      if (user && passwordEquals) {
        return { accessToken, refreshToken };
      }

      throw new UnauthorizedException({
        message: 'incorrect email or password',
      });
    } else {
      throw new HttpException('user not verified', HttpStatus.BAD_REQUEST);
    }
  }

  async confirmEmail(verifyId: string): Promise<any> {
    const verifyUser =
      await this.acceptService.findAndVerifyUserByAcceptId(verifyId);
    return this.userService.verifyUser(verifyUser.userId);
  }

  async saveToken(userId: number, refreshToken: string) {
    const token = await UserToken.findOne({
      where: {
        userId,
      },
    });
    if (token) {
      token.refreshToken = refreshToken;
      return token.save();
    }
    return UserToken.create({
      userId,
      refreshToken,
    });
  }

  async generateToken(user: User) {
    try {
      const payload = {
        email: user.email,
        id: user.id,
        role: user.roles?.map((role) => role.role),
      };

      return {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '12h',
          secret: process.env.ACCESS_KEY,
        }),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: '30d',
          secret: process.env.REFRESH_KEY,
        }),
      };
    } catch (err) {
      throw err;
    }
  }
}
