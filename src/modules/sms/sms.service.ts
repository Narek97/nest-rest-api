import { BadRequestException, Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import * as process from 'process';

@Injectable()
export class SmsService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSms(to: string, message: string): Promise<void> {
    try {
      await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: 'Twilio Error ... ' }, err);
    }
  }
}
