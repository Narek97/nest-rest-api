import { Injectable } from '@nestjs/common';
import { ErrorLogs } from '../../database/models';

@Injectable()
export class ErrorLogsService {
  async addErrorLogs(dto: any): Promise<ErrorLogs> {
    return ErrorLogs.create(dto);
  }
}
