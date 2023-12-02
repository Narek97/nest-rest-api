import { Module } from '@nestjs/common';
import { AcceptService } from './accept.service';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [AcceptService],
  imports: [UsersModule, MailModule],
  exports: [AcceptService],
})
export class AcceptModule {}
