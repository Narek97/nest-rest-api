import { Module } from '@nestjs/common';
import { UserCodeService } from './user-code.service';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  providers: [UserCodeService],
  imports: [UsersModule, MailModule],
  exports: [UserCodeService],
})
export class UserCodeModule {}
