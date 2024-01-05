import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/user.decorator';
import { User } from '../../database/models';
import { TransactionParam } from '../../decorators/transaction-param.decorator';
import { Transaction } from 'sequelize';

@UseGuards(AuthGuard)
@Controller('initiatives')
export class InitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Post('/create')
  create(
    @Body() dto: CreateInitiativeDto,
    @GetUser() user: User,
    @TransactionParam() transaction: Transaction,
    @Req() { sqlRowQueries }: any,
  ) {
    return this.initiativesService.create(
      dto,
      user,
      transaction,
      sqlRowQueries,
    );
  }

  @Get('/get')
  findAll(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Req() { sqlRowQueries }: any,
  ) {
    return this.initiativesService.findAll(
      { offset, limit, search },
      sqlRowQueries,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() { sqlRowQueries }: any) {
    return this.initiativesService.findOne(+id, sqlRowQueries);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() { sqlRowQueries }: any,
    @Body() dto: UpdateInitiativeDto,
  ) {
    return this.initiativesService.update(+id, sqlRowQueries, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() { sqlRowQueries }: any) {
    return this.initiativesService.remove(+id, sqlRowQueries);
  }
}
