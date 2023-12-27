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
import * as process from 'process';
import { RoleEnum } from '../../common/enums';
import { VerifyTwoFADto } from './dto/verify-two-fa.dto';
import { UserCodeService } from '../user-code/user-code.service';
import { TwoFAService } from '../../services/2fa.service';

@Injectable()
export class AuthService {
  constructor(
    readonly userService: UsersService,
    readonly userCodeService: UserCodeService,
    readonly mailService: MailService,
    readonly smsService: SmsService,
    readonly jwtService: JwtService,
    readonly twoFAService: TwoFAService,
  ) {}

  async registration(
    dto: CreateUserDto,
    sqlRowQueries: string[],
  ): Promise<User> {
    const candidate = await this.userService.getUserByEmail(
      dto.email,
      sqlRowQueries,
    );
    if (candidate) {
      throw new HttpException(
        { message: ['user already exist'] },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser(
      {
        ...dto,
        password: hashPassword,
      },
      sqlRowQueries,
    );
    const activationLink = uuid();
    await this.mailService.sendSignupVerifyEmail(user.email, activationLink);
    await this.userCodeService.createUserCode(
      user.id,
      activationLink,
      sqlRowQueries,
    );

    return user;
  }

  async login(
    dto: loginUserDto,
    sqlRowQueries: string[],
  ): Promise<LoginUserResponse> {
    const user = await this.checkValidateUser(dto, sqlRowQueries);

    const { accessToken, refreshToken } = await this.generateToken(user);
    if (user.isTwoFactorEnable) {
      if (user.roles.some((el) => el.role === RoleEnum.ADMIN)) {
        return {
          twoFAToken: this.jwtService.sign(
            {
              id: user.id,
              email: user.email,
            },
            { expiresIn: '10m', secret: process.env.TWOFA_ACCESS_KEY },
          ),
        };
      } else {
        const min = 10000000;
        const max = 99999999;
        const activationLink =
          Math.floor(Math.random() * (max - min + 1)) + min;
        await this.smsService.sendSms(
          '+37477345522',
          activationLink.toString(),
        );
        await this.userCodeService.createUserCode(
          user.id,
          activationLink.toString(),
          sqlRowQueries,
        );
        return { message: "The code has been sent to the user's phone number" };
      }
    } else {
      await this.saveToken(user.id, refreshToken, sqlRowQueries);
      return { accessToken, refreshToken };
    }
  }

  async loginCode(
    dto: loginCodeUserDto,
    sqlRowQueries: string[],
  ): Promise<LoginUserResponse> {
    const userCode = await this.userCodeService.findUserCodeByCode(
      dto.code,
      sqlRowQueries,
    );

    if (!userCode) {
      throw new HttpException(
        { message: 'code not valid' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.getUserById(
      userCode.userId,
      sqlRowQueries,
    );
    if (!user) {
      throw new HttpException(
        { message: 'user not find' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { accessToken, refreshToken } = await this.generateToken(user);
    await UserCode.destroy({
      where: {
        userId: userCode.userId,
        code: userCode.code,
      },
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
    await this.saveToken(user.id, refreshToken, sqlRowQueries);
    return { accessToken, refreshToken };
  }

  async generateQrCode(user: User, sqlRowQueries: string[]): Promise<any> {
    const secret = await this.twoFAService.generateSecret(user.email);
    const gToken = secret.otpauth_url;
    await this.userCodeService.createUserCode(user.id, gToken, sqlRowQueries);
    const qrCode = await this.twoFAService.getQRCode(gToken);
    return { qrCode };
  }

  async verifyTwoFA(
    dto: VerifyTwoFADto,
    sqlRowQueries: string[],
  ): Promise<any> {
    const userCode = await this.userCodeService.findUserCodeByCode(
      dto.code,
      sqlRowQueries,
    );
    if (userCode) {
      const isVerified = await this.twoFAService.verifyQRCode(
        userCode.code,
        dto.code,
      );
      if (isVerified) {
        const user = await this.userService.getUserById(
          userCode.userId,
          sqlRowQueries,
        );
        const { accessToken, refreshToken } = await this.generateToken(user);
        return { accessToken, refreshToken };
      } else {
        throw new HttpException(
          { message: 'Code is invalid' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException(
      { message: 'user not found' },
      HttpStatus.BAD_REQUEST,
    );
  }

  async refreshToken(refreshToken: string, sqlRowQueries: string[]) {
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
      await this.saveToken(userData.id, newRefreshToken, sqlRowQueries);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }

  async confirmEmail(verifyId: string, sqlRowQueries: string[]): Promise<any> {
    const userCode = await this.userCodeService.findUserCodeByCode(
      verifyId,
      sqlRowQueries,
    );
    await UserCode.destroy({
      where: {
        userId: userCode.userId,
        code: userCode.code,
      },
      logging: (sql) => {
        sqlRowQueries.push(sql);
      },
    });
    return this.userService.verifyUser(userCode.id, sqlRowQueries);
  }

  async saveToken(
    userId: number,
    refreshToken: string,
    sqlRowQueries: string[],
  ) {
    const token = await UserToken.findOne({
      where: {
        userId,
      },
    });
    if (token) {
      token.refreshToken = refreshToken;
      return token.save();
    }
    return UserToken.create(
      {
        userId,
        refreshToken,
      },
      {
        logging: (sql) => {
          sqlRowQueries.push(sql);
        },
      },
    );
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

  async checkValidateUser(
    dto: loginUserDto,
    sqlRowQueries: string[],
  ): Promise<User> {
    const user = await this.userService.getUserByEmail(
      dto.email,
      sqlRowQueries,
    );
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
      return user;
    } else {
      throw new HttpException(
        { message: 'user not verified' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
