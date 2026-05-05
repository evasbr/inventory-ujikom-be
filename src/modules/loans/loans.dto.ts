import {
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestLoanDto {
  @ApiProperty({ example: 'uuid-barang-disini' })
  @IsUUID()
  inventoryId: string;

  @ApiProperty({ example: 'Budi Darmawan' })
  @IsString()
  borrowerName: string;

  @ApiPropertyOptional({ example: 'Untuk keperluan presentasi klien' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: '2026-05-10T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export type LoanStatus =
  | 'PENDING'
  | 'REJECTED'
  | 'ONGOING'
  | 'RETURNED'
  | 'OVERDUE';

// Variabel bantu untuk class-validator dan Swagger
const loanStatusOptions: LoanStatus[] = [
  'PENDING',
  'REJECTED',
  'ONGOING',
  'RETURNED',
  'OVERDUE',
];

export class LoanStatusUpdateDto {
  @ApiProperty({
    description: 'Status peminjaman barang',
    enum: loanStatusOptions,
    example: 'ONGOING',
  })
  @IsIn(loanStatusOptions, {
    message:
      'Status harus salah satu dari: PENDING, REJECTED, ONGOING, RETURNED, OVERDUE',
  })
  // Gunakan | untuk tipe datanya juga
  status: LoanStatus;
}
