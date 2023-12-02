import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendgridService } from '../../services/sendgrit.service';

@Module({
  imports: [],
  providers: [MailService, SendgridService],
  exports: [MailService],
})
export class MailModule {}
