import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { InitiativesModule } from '../initiatives/initiatives.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [forwardRef(() => InitiativesModule)],
  exports: [TasksService],
})
export class TasksModule {}
