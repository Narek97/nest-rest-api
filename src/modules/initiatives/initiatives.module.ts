import { forwardRef, Module } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { InitiativesController } from './initiatives.controller';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  controllers: [InitiativesController],
  providers: [InitiativesService],
  imports: [forwardRef(() => TasksModule)],
  exports: [InitiativesService],
})
export class InitiativesModule {}
