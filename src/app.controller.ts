import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger('App');

  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    this.logger.log('connected');
    return this.appService.start();
  }
}
