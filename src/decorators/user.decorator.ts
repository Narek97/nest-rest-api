import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../database/models';

interface ExpressRequestInterface extends Request {
  user?: User;
}

export const GetUser = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>();
    return key ? request.user?.[key] : request.user;
  },
);
