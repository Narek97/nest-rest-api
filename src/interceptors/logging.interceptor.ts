import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: any, next: CallHandler): Observable<any> {
    //Before...
    const request = context.switchToHttp().getRequest();
    request.sqlRowQueries = [];

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        // After...
        const req = context.switchToHttp().getRequest();

        const encoder = new TextEncoder();
        const payloadSizeInBytes = encoder.encode(data).length;
        // console.log((JSON.stringify(data).length / 1024).toFixed(2), 'size');
        // console.log(payloadSizeInBytes, 'payloadSizeInBytes');
        // console.log(req.url, 'req');
        // console.log(req.method, 'req');
        // console.log(req.sqlRowQueries, 'req');
        console.log(`After... ${Date.now() - now}ms`);
      }),
    );
  }
}
