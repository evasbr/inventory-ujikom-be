import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { RequestLoanDto } from './loans.dto';

@ApiTags('Peminjaman (Loans)')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @ApiOperation({ summary: 'Input permintaan peminjaman baru' })
  request(@Body() dto: RequestLoanDto) {
    return this.loansService.createRequest(dto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Proses persetujuan peminjaman' })
  approve(@Param('id') id: string) {
    return this.loansService.approveLoan(id);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Proses pengembalian barang' })
  return(@Param('id') id: string) {
    return this.loansService.returnItem(id);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat semua riwayat transaksi' })
  findAll() {
    return this.loansService.findAll();
  }
}
