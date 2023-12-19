import { Module } from '@nestjs/common';
import { ErrorLogsService } from './error-logs.service';

@Module({
  controllers: [],
  providers: [ErrorLogsService],
})
export class ErrorLogsModule {}
