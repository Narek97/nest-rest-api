import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TransactionParam = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.transaction;
  },
);
