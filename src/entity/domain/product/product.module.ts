import { Module } from '@nestjs/common';
import { ProductNumberFactory } from 'src/entity/domain/product/product-number-factory';
import { ProductService } from 'src/entity/domain/product/product.service';

@Module({
  providers: [ProductService, ProductNumberFactory],
  exports: [ProductService],
})
export class ProductModule {}
