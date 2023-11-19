import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserRequest, RegisterUserResponse } from './types';
import { User } from '../../database/models';

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
}
