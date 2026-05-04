import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './database/db.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [DbModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
