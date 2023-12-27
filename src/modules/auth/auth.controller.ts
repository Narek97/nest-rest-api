import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginCodeReques,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  TokenResponse,
  Verify2faRequest,
} from './types';
import { User } from '../../database/models';
import { Public } from '../../decorators/public.decorator';
import { Response, Request } from 'express';
import { loginCodeUserDto, loginUserDto } from '../users/dto/login-user.dto';
import { VerifyTwoFADto } from './dto/verify-two-fa.dto';
import { QRCodeType } from '../../common/types/base.response-type';
import { Roles } from '../../decorators/roles.decorator';
import { RoleEnum } from '../../common/enums';
import { GetUser } from '../../decorators/user.decorator';
import { RolesGuard } from '../../guards/role.guard';
import { TwoFAAuthGuard } from '../../guards/2fa.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterUserRequest })
  @ApiOkResponse({ type: RegisterUserResponse })
  @Post('/registration')
  async registration(
    @Body() dto: CreateUserDto,
    @Req() { sqlRowQueries }: any,
  ): Promise<User> {
    return this.authService.registration(dto, sqlRowQueries);
  }

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login')
  async login(
    @Body() dto: loginUserDto,
    @Req() { sqlRowQueries }: any,
  ): Promise<LoginUserResponse> {
    return this.authService.login(dto, sqlRowQueries);
  }

  @ApiBody({ type: LoginCodeReques })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login/code')
  async loginCode(
    @Body() dto: loginCodeUserDto,
    @Req() { sqlRowQueries }: any,
  ): Promise<LoginUserResponse> {
    return this.authService.loginCode(dto, sqlRowQueries);
  }

  @UseGuards(TwoFAAuthGuard, RolesGuard)
  @Get('/generate-qr-code')
  @ApiOperation({ summary: 'Generate QR Code' })
  @ApiOkResponse({ type: QRCodeType })
  @Roles(RoleEnum.ADMIN)
  async getQrCode(
    @GetUser() user: User,
    @Req() { sqlRowQueries }: any,
  ): Promise<any> {
    return this.authService.generateQrCode(user, sqlRowQueries);
  }

  @ApiBody({ type: Verify2faRequest })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(TwoFAAuthGuard, RolesGuard)
  @Post('/verify-2fa')
  @Roles(RoleEnum.ADMIN)
  async verifyTwoFA(
    @Body() dto: VerifyTwoFADto,
    @Req() { sqlRowQueries }: any,
  ): Promise<any> {
    return this.authService.verifyTwoFA(dto, sqlRowQueries);
  }

  @Get('/refresh-token')
  @ApiOkResponse({ type: TokenResponse })
  async refreshToken(@Req() req: Request, @Req() { sqlRowQueries }: any) {
    const { refreshToken } = req.cookies;
    return this.authService.refreshToken(refreshToken, sqlRowQueries);
  }

  @ApiExcludeEndpoint()
  @Get('/verify-email')
  @Public()
  async confirmEmail(
    @Res() res: Response,
    @Req() { sqlRowQueries }: any,
    @Query('verifyId') verifyId: string,
  ) {
    try {
      await this.authService.confirmEmail(verifyId, sqlRowQueries);
      res.redirect(`${process.env.APP_URL}/login`);
    } catch (error) {
      res.redirect(`${process.env.APP_URL}/login?verify=false`);
    }
  }
}
