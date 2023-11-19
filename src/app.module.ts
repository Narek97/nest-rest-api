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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
