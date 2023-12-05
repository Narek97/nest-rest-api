import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { SmsModule } from '../sms/sms.module';
import { UserCode } from '../user-code/user-code.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, UserCode, MailModule, SmsModule],
})
export class AuthModule {}
