import { Module } from '@nestjs/common';
import { AcceptService } from './accept.service';

@Module({
  providers: [AcceptService],
  imports: [],
  exports: [AcceptService],
})
export class AcceptModule {}
