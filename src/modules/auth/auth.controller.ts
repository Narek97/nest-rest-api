import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginCodeReques,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from './types';
import { User } from '../../database/models';
import { Public } from '../../decorators/public.decorator';
import { Response, Request } from 'express';
import { loginCodeUserDto, loginUserDto } from '../users/dto/login-user.dto';
import { BaseMessageResponseType } from '../../common/types/base.response-type';

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

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: BaseMessageResponseType })
  @Post('/login2fa')
  async login2fa(@Body() dto: loginUserDto): Promise<BaseMessageResponseType> {
    return this.authService.login2fa(dto);
  }

  @ApiBody({ type: LoginCodeReques })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login/code')
  async loginCode(@Body() dto: loginCodeUserDto): Promise<LoginUserResponse> {
    return this.authService.loginCode(dto);
  }

  @Get('/refresh-token')
  @ApiOkResponse({ type: LoginUserResponse })
  async refreshToken(@Req() req: Request) {
    const { refreshToken } = req.cookies;
    return this.authService.refreshToken(refreshToken);
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

// @ApiHeader({
//   name: 'refreshToken',
// })
