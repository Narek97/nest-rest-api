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
import { User, UserCode, UserToken } from '../../database/models';
import { MailService } from '../mail/mail.service';
import { loginCodeUserDto, loginUserDto } from '../users/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserResponse } from './types';
import { SmsService } from '../sms/sms.service';
import { BaseMessageResponseType } from '../../common/types/base.response-type';
import { UserCodeService } from '../user-code/user-code.service';

@Injectable()
export class AuthService {
  constructor(
    readonly userService: UsersService,
    readonly userCodeService: UserCodeService,
    readonly mailService: MailService,
    readonly smsService: SmsService,
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
    await this.userCodeService.createUserCode(user.id, activationLink);

    return user;
  }

  async login(dto: loginUserDto): Promise<LoginUserResponse> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'incorrect email or password',
      });
    }
    if (user.isTwoFactorEnable) {
      throw new HttpException(
        { message: 'turn off 2fa verification' },
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        { message: 'user not verified' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login2fa(dto: loginUserDto): Promise<BaseMessageResponseType> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'incorrect email or password',
      });
    }
    if (!user.isTwoFactorEnable) {
      throw new HttpException(
        { message: 'turn on 2fa verification' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.verified) {
      const passwordEquals = await bcrypt.compare(dto.password, user.password);
      if (!passwordEquals) {
        throw new UnauthorizedException({
          message: 'incorrect email or password',
        });
      }
      const min = 10000000;
      const max = 99999999;
      const activationLink = Math.floor(Math.random() * (max - min + 1)) + min;
      await this.smsService.sendSms('+37477345522', activationLink.toString());
      await this.userCodeService.createUserCode(
        user.id,
        activationLink.toString(),
      );
      return { message: "The code has been sent to the user's phone number" };
    } else {
      throw new HttpException(
        { message: 'user not found' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async loginCode(dto: loginCodeUserDto): Promise<LoginUserResponse> {
    const verifyUser = await this.verifyUserByCode(dto.code);
    if (!verifyUser.userId) {
      throw new HttpException(
        { message: 'code not valid' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.getUserById(verifyUser.userId);
    if (!user) {
      throw new HttpException(
        { message: 'user not find' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { accessToken, refreshToken } = await this.generateToken(user);
    await this.saveToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async confirmEmail(verifyId: string): Promise<any> {
    const verifyUser = await this.verifyUserByCode(verifyId);
    return this.userService.verifyUser(verifyUser.userId);
  }

  async refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      const userData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_KEY,
      });
      if (!userData) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateToken(userData);
      await this.saveToken(userData.id, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
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

  async verifyUserByCode(verifyId: string): Promise<UserCode> {
    const verifyUser = await UserCode.findOne({
      where: {
        code: verifyId,
      },
    });
    if (!verifyUser) {
      throw new HttpException(
        { message: 'invalid code' },
        HttpStatus.BAD_REQUEST,
      );
    }
    await UserCode.destroy({
      where: {
        userId: verifyUser.userId,
        code: verifyId,
      },
    });
    return verifyUser;
  }
}
