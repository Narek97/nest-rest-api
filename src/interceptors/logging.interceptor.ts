import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as dotenv from 'dotenv';
import { LogsService } from '../modules/logs/logs.service';
dotenv.config();

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: any, next: CallHandler): Observable<any> {
    //Before...
    const request = context.switchToHttp().getRequest();
    request.sqlRowQueries = [];

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        // After...
        const req = context.switchToHttp().getRequest();

        // const encoder = new TextEncoder();
        // const payloadSizeInBytes = encoder.encode(data).length;
        this.logsService.addPerformanceLogs({
          user: req.user || {},
          path: req.path,
          method: req.method,
          responseTime: Date.now() - now,
          payloadSize: (JSON.stringify(data).length / 1024).toFixed(2),
          queryCount: req.sqlRowQueries.length,
          sqlRowQueries: req.sqlRowQueries,
        });
        console.log(`After... ${Date.now() - now}ms`);
      }),
    );
  }
}
