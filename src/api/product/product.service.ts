import { Injectable } from '@nestjs/common';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { ProductResponse } from './product.response';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getSellingProducts() {
    const products = await this.productRepository.findAllBySellingStatusIn(
      ProductSellingStatus.forDisplay(),
    );

    return products.map(ProductResponse.of);
  }
}
