import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AcceptModule } from '../accept/accepy.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, AcceptModule],
})
export class AuthModule {}
