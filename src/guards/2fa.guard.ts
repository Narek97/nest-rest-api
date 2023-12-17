import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class TwoFAAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      const decodedUser = await this.jwtService.verify(token, {
        secret: process.env.TWOFA_ACCESS_KEY,
      });
      console.log(11);

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      if (decodedUser?.id) {
        const user = await this.userService.getUserById(decodedUser.id);
        console.log(user, 'user');
        if (user) {
          req.user = user;
        } else {
          throw new UnauthorizedException({ message: 'Unauthorized' });
        }
      } else {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
