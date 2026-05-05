import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { DbModule } from '../../database/db.module';

@Module({
  imports: [DbModule],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
