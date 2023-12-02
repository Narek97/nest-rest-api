import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from './types';
import { User } from '../../database/models';
import { Public } from '../../decorators/publicj.decorator';
import { Response } from 'express';
import { loginUserDto } from '../users/dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterUserRequest })
  @ApiOkResponse({ type: RegisterUserResponse })
  @Post('/registration')
  async registration(@Body() dto: CreateUserDto): Promise<User> {
    return this.authService.registration(dto);
  }

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login')
  async login(@Body() dto: loginUserDto): Promise<LoginUserResponse> {
    return this.authService.login(dto);
  }

  @ApiExcludeEndpoint()
  @Get('/verify-email')
  @Public()
  async confirmEmail(
    @Res() res: Response,
    @Query('verifyId') verifyId: string,
  ) {
    try {
      await this.authService.confirmEmail(verifyId);
      res.redirect(`${process.env.APP_URL}/login`);
    } catch (error) {
      res.redirect(`${process.env.APP_URL}/login?verify=false`);
    }
  }
}
