import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DBModule.forRoot(),
  ],
})
export class CoreModule {}
