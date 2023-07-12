import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductModule } from 'src/entity/domain/product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [ProductController],
})
export class ProductApiModule {}
