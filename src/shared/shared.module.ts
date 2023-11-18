import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

const providers = [];

const imports: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
];

// if (!process.env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE == '0') {
//   imports.push();
//   // ...,
// }

@Global()
@Module({
  providers,
  imports,
  exports: [...providers],
})
export class SharedModule {}
