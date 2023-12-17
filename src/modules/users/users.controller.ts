import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/user.decorator';
import { User } from '../../database/models';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetMeResponse, ToggleTwoFactorVerificationResponse } from './types';
import { RolesGuard } from '../../guards/role.guard';
import { UpdateUserTwoFactorVerification } from './dto/update-user.dto';
import { BaseMessageResponseType } from '../../common/types/base.response-type';

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

  @ApiBody({ type: ToggleTwoFactorVerificationResponse })
  @ApiOkResponse({ type: BaseMessageResponseType })
  @Patch('/toggle-two-factor-verification')
  ToggleTwoFactorVerification(
    @GetUser() user: User,
    @Body() dto: UpdateUserTwoFactorVerification,
  ): Promise<BaseMessageResponseType> {
    return this.usersService.toggleTwoFactorVerification(user, dto);
  }
}
