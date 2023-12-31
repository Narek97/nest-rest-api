import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { LogsService } from '../modules/logs/logs.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorLogsService: LogsService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = response.statusCode ?? exception?.getStatus();
    const message =
      exception?.response?.message ||
      exception?.message ||
      'Internal server error';

    try {
      await this.errorLogsService.addErrorLogs({
        status,
        message: Array.isArray(message) ? message.join() : message,
        path: request.url,
        type: request.method,
      });
      if (status == 409 || status == 422 || status == 401 || status === 403) {
        return response.status(status).json(exception.response);
      }
      if (status == 500) {
        return response.status(status).json(exception);
      }
      if (
        status == 400 &&
        exception?.response?.message &&
        Array.isArray(exception?.response?.message)
      ) {
        return response
          .status(422)
          .json(
            exception.response.message[0] ||
              'Something went wrong (Server Error, HttpExceptionFilter)',
          );
      }
      throw { response: message };
      // return response.status(status).json(exception.response);
    } catch (err) {
      if (response) {
        response
          .status(500)
          .json(
            err?.response ||
              'Something went wrong (Server Error, HttpExceptionFilter last catch)',
          );
      } else {
        return [
          err?.response ||
            'Something went wrong (Server Error, HttpExceptionFilter last catch)',
        ];
      }
    }
  }
}
