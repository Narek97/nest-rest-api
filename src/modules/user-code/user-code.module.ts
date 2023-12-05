import { Module } from '@nestjs/common';
import { UserCodeService } from './user-code.service';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [UserCodeService],
  imports: [UsersModule, MailModule],
  exports: [UserCodeService],
})
export class UserCode {}
