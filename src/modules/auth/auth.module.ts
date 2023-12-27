import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { SmsModule } from '../sms/sms.module';
import { UserCodeModule } from '../user-code/user-code.module';
import { TwoFAService } from '../../services/2fa.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TwoFAService],
  imports: [UsersModule, MailModule, SmsModule, UserCodeModule],
})
export class AuthModule {}
