import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGuard } from '../guards/socket.guard';
import { User } from '../database/models';
import { UnauthorizedException } from '@nestjs/common';

export type clientWithUser = Socket & { user: User };

@WebSocketGateway({
  namespace: '/api/task-socket',
  transports: ['websocket', 'polling'],
  pingInterval: 5000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  allowEIO3: true,
})
export class TaskGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(protected socketGuard: SocketGuard) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('start', server);
  }

  async handleConnection(client: clientWithUser) {
    try {
      const user: User = await this.socketGuard.connectAuth(client);
      if (!user) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }
      await user.save();

      client.user = user.get({ plain: true });
      console.log(`User ${client.user.email} connected`);
    } catch (e) {
      client.emit('error', { error: e });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: clientWithUser): void {
    if (client.user) {
      console.log(`User ${client.user.email} disconnected`);
    }
  }

  @SubscribeMessage('join-task-comment')
  async joinBoard(
    @ConnectedSocket() client: clientWithUser,
    @MessageBody() { id }: any,
  ): Promise<void> {
    await client.join(`task-${id}`);
  }

  @SubscribeMessage('leave-task-comment')
  async leaveBoard(
    @ConnectedSocket() client: clientWithUser,
    @MessageBody() { id }: any,
  ): Promise<void> {
    await client.leave(`task-${id}`);
  }

  @SubscribeMessage('task-comment')
  onNewMessage(
    @ConnectedSocket() client: clientWithUser,
    @MessageBody() body: any,
  ) {
    this.server.compress(true).to(`task-${body.id}`).emit('task-comment', body);
    // this.server.emit('taskComment', {
    //   content: body,
    // });
  }
}
