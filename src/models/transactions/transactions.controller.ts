import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const userId = request.user.id;

    return this.transactionsService.create(createTransactionDto, userId);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'transaction_type',
    required: false,
    type: String,
    example: 'transfer',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2023-08-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2023-08-31',
  })
  @ApiQuery({ name: 'minAmount', required: false, type: Number, example: 100 })
  @ApiQuery({ name: 'maxAmount', required: false, type: Number, example: 1000 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'transaction_date',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({
    name: 'user_id',
    required: false,
    type: Number,
    example: 1,
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('transaction_type') transactionType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number,
    @Query('sortBy') sortBy: string = 'transaction_date',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('user_id') userId?: string,
  ) {
    const filters = {
      transaction_type: transactionType,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      user_id: userId ? parseInt(userId, 10) : undefined,
    };

    return this.transactionsService.findAll(
      page,
      limit,
      filters,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
