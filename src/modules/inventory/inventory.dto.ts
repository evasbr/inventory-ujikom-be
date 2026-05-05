import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type InventoryStatus = 'AVAILABLE' | 'BORROWED' | 'BROKEN';

const inventoryStatusOptions: InventoryStatus[] = [
  'AVAILABLE',
  'BORROWED',
  'BROKEN',
];

export class CreateInventoryDto {
  @ApiProperty({
    description: 'Nama barang inventaris',
    example: 'Laptop ASUS ROG',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Deskripsi detail, spesifikasi, atau kondisi awal barang',
    example: 'RAM 16GB, SSD 512GB, Warna Hitam',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateInventoryDto {
  @ApiPropertyOptional({
    description: 'Nama barang inventaris yang ingin diubah',
    example: 'Laptop ASUS ROG (Updated)',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Deskripsi barang yang ingin diubah',
    example: 'RAM di-upgrade jadi 32GB',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateInventoryStatusDto {
  @ApiProperty({
    description: 'Status ketersediaan barang',
    enum: inventoryStatusOptions,
    example: 'BROKEN',
  })
  @IsIn(inventoryStatusOptions, {
    message: 'Status harus salah satu dari: AVAILABLE, BORROWED, BROKEN',
  })
  status: InventoryStatus;
}

export class FindAllInventoryDto {
  @ApiPropertyOptional({
    description: 'Cari berdasarkan nama barang (partial match)',
    example: 'Laptop',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan status barang',
    enum: ['AVAILABLE', 'BORROWED', 'BROKEN'],
    example: 'AVAILABLE',
  })
  @IsOptional()
  @IsIn(['AVAILABLE', 'BORROWED', 'BROKEN'], {
    message: 'Status harus salah satu dari: AVAILABLE, BORROWED, atau BROKEN',
  })
  status?: string;
}
