import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '../database/models';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<Socket>();
      console.log(client, 'client');

      return false;
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  async connectAuth(client: Socket): Promise<User | null> {
    try {
      return this.getUserByToken(client);
    } catch (err) {
      Logger.log('socket connection error', err);
    }
  }

  async getUserByToken(client: Socket): Promise<User | null> {
    try {
      const authHeader = client.handshake.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      const decodedUser = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_KEY,
      });

      if (bearer !== 'Bearer' || !token || !decodedUser.id) {
        return null;
      } else {
        const user = await User.findByPk(decodedUser.id, {
          include: {
            model: Role,
            attributes: {
              exclude: [],
            },
          },
          attributes: { exclude: ['password'] },
        });

        return user || null;
      }
    } catch (e) {
      return null;
    }
  }
}
