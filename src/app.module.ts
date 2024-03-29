import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { OrganisationsModule } from './modules/organisations/organisations.module';
import { CompanyModule } from './modules/company/company.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { RolesModule } from './modules/roles/roles.module';
import { InitiativesModule } from './modules/initiatives/initiatives.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { UserCodeModule } from './modules/user-code/user-code.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TasksModule } from './modules/tasks/tasks.module';
import { TransactionInterceptor } from './interceptors/transaction.interceptor';
import { TaskCommentsModule } from './modules/task_comments/task_comments.module';
import { TaskCommentAnswersModule } from './modules/task_comment_answers/task_comment_answers.module';
import { GatewayModule } from './gateway/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    UsersModule,
    OrganisationsModule,
    CompanyModule,
    WorkspaceModule,
    RolesModule,
    InitiativesModule,
    AttachmentModule,
    SuperAdminModule,
    AuthModule,
    UserCodeModule,
    TasksModule,
    TaskCommentsModule,
    TaskCommentAnswersModule,
    GatewayModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      max: 100,

      store: redisStore,
      socket: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
  ],
})
export class AppModule {}
