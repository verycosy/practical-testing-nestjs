import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductNumberFactory } from './product-number-factory';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductNumberFactory],
})
export class ProductApiModule {}
