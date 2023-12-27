import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../database/models';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      return user.roles.some((role: Role) => requiredRoles.includes(role.role));
    } catch (e) {
      throw new HttpException('Dont have permission', HttpStatus.FORBIDDEN);
    }
  }
}
