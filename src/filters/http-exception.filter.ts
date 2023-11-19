import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // constructor(private readonly errorLogsService: ErrorLogsService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = response.statusCode ?? exception?.getStatus();
    const message = exception?.message || 'Internal server error';
    const type: any = host.getType();
    try {
      // await this.errorLogsService.add({
      //   status,
      //   error: exception,
      //   message: exception?.response?.message || exception?.message,
      //   query: exception?.query,
      //   requestMethod: request?.method,
      //   requestUrl: request?.url,
      // });
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
      return response.status(status).json(exception.response);
    } catch (err) {
      // await this.errorLogsService.add({
      //   status,
      //   error: err,
      //   message: err?.response?.message || err?.message,
      //   query: err?.query,
      //   requestMethod: request?.method,
      //   requestUrl: request?.url,
      // });
      if (response) {
        response
          .status(500)
          .json(
            err?.response ||
              'Something went wrong (Server Error, HttpExceptionFilter last catch)',
          );
      } else {
        return (
          err?.response ||
          'Something went wrong (Server Error, HttpExceptionFilter last catch)'
        );
      }
    }
  }
}
