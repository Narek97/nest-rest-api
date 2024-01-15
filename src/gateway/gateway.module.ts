import { Module } from '@nestjs/common';
import { TaskGateway } from './task.gateway';
import { SocketGuard } from '../guards/socket.guard';

@Module({
  providers: [TaskGateway, SocketGuard],
})
export class GatewayModule {}
