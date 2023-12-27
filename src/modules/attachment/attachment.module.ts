import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AttachmentController],
  providers: [AttachmentService],
  imports: [UsersModule],
})
export class AttachmentModule {}
