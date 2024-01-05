import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Sequelize transaction
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelizeInstance: Sequelize,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Before
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const transaction: Transaction = await this.sequelizeInstance.transaction({
      logging: true, // Just for debugging purposes
    });
    req.transaction = transaction;

    let isCommitted = false;

    transaction.afterCommit(() => {
      isCommitted = true;
    });

    return next.handle().pipe(
      tap(async () => {
        //After
        if (!isCommitted) {
          await transaction.commit();
        }
      }),
      catchError(async (err) => {
        await transaction.rollback();
        throw err;
      }),
    );
  }
}
