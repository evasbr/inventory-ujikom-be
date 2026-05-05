import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './database/db.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { LoansModule } from './modules/loans/loans.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    DbModule,
    InventoryModule,
    LoansModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
