import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { DbModule } from '../../database/db.module';

@Module({
  imports: [DbModule],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
