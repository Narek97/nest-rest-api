import { BadRequestException, Injectable } from '@nestjs/common';
import * as process from 'process';
import { SendgridService } from '../../services/sendgrit.service';

@Injectable()
export class MailService {
  private readonly EMAIL_FROM: string;

  constructor(private readonly sendgridService: SendgridService) {
    this.EMAIL_FROM = process.env.EMAIL_FROM;
  }

  async sendSignupVerifyEmail(email: string, activationLink: string) {
    try {
      const url = `${process.env.API_URL}/api/auth/verify-email?verifyId=${activationLink}`;
      const mail = {
        to: email,
        from: { email: this.EMAIL_FROM, name: 'Nest Rest API' },
        subject: 'Verify your email',
        templateId: process.env.SENDGRID_TEMPLATE_KEY,
        dynamicTemplateData: { url },
      };
      return this.sendgridService.send(mail);
    } catch (err) {
      throw new BadRequestException({ message: 'SendGrid Error ... ' }, err);
    }
  }
}
