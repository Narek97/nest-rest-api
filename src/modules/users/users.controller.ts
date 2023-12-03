import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/user.decorator';
import { User } from '../../database/models';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetMeResponse } from './types';
import { RolesGuard } from '../../guards/role.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOkResponse({ type: GetMeResponse })
  getMe(@GetUser() user: User): Promise<User> {
    return this.usersService.getMe(user.id);
  }
}
