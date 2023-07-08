import { Injectable } from '@nestjs/common';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { ProductResponse } from './product.response';
import { Transactional } from 'typeorm-transactional';
import { ProductNumberFactory } from './product-number-factory';
import {
  CreateProductParams,
  Product,
} from 'src/entity/domain/product/product.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productNumberFactory: ProductNumberFactory,
  ) {}

  @Transactional()
  async createProduct(params: Omit<CreateProductParams, 'productNumber'>) {
    const nextProductNumber =
      await this.productNumberFactory.createNextProductNumber();

    const product = new Product({
      ...params,
      productNumber: nextProductNumber,
    });
    const savedProduct = await this.productRepository.save(product);

    return ProductResponse.of(savedProduct);
  }

  async getSellingProducts() {
    const products = await this.productRepository.findAllBySellingStatusIn(
      ProductSellingStatus.forDisplay(),
    );

    return products.map(ProductResponse.of);
  }
}
