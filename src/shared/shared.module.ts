import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtConfigOptions } from '../config/jwt-config';
import { MailModule } from '../modules/mail/mail.module';
import { SmsModule } from '../modules/sms/sms.module';
import { AWSS3Service } from '../services/aws-s3.service';

const providers = [AWSS3Service];

const imports: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  ScheduleModule.forRoot(),
  JwtModule.register(JwtConfigOptions),
  MailModule,
  SmsModule,
];

@Global()
@Module({
  providers,
  imports,
  exports: [...providers, JwtModule],
})
export class SharedModule {}
