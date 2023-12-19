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
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { UserCodeModule } from './modules/user-code/user-code.module';
import { ErrorLogsModule } from './modules/error-logs/error-logs.module';
import { ErrorLogsService } from './modules/error-logs/error-logs.service';

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
    ErrorLogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ErrorLogsService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
