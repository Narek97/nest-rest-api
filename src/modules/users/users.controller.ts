import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/user.decorator';
import { User } from '../../database/models';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetMeResponse, ToggleTwoFactorVerificationResponse } from './types';
import { RolesGuard } from '../../guards/role.guard';
import { UpdateUserTwoFactorVerification } from './dto/update-user.dto';
import { BaseMessageResponseType } from '../../common/types/base.response-type';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({ type: GetMeResponse })
  getMe(@GetUser() user: User, @Req() { sqlRowQueries }: any): Promise<User> {
    return this.usersService.getMe(user.id, sqlRowQueries);
  }

  @ApiBody({ type: ToggleTwoFactorVerificationResponse })
  @ApiOkResponse({ type: BaseMessageResponseType })
  @Patch('/toggle-two-factor-verification')
  ToggleTwoFactorVerification(
    @GetUser() user: User,
    @Body() dto: UpdateUserTwoFactorVerification,
    @Req() { sqlRowQueries }: any,
  ): Promise<BaseMessageResponseType> {
    return this.usersService.toggleTwoFactorVerification(
      user,
      dto,
      sqlRowQueries,
    );
  }

  @Get('/:id')
  getUserById(
    @Param('id') id: string,
    @Req() { sqlRowQueries }: any,
  ): Promise<User> {
    return this.usersService.getUserById(+id, sqlRowQueries);
  }
}
