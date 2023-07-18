import { Injectable } from '@nestjs/common';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { Transactional } from 'typeorm-transactional';
import { ProductNumberFactory } from './product-number-factory';
import { CreateProductParams, Product } from './product.entity';

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

    return await this.productRepository.save(product);
  }

  async updateProduct(id: number, newPrice: number) {
    const product = await this.productRepository.findOneOrFail({
      where: {
        id,
      },
    });

    product.setPrice(newPrice);

    return await this.productRepository.save(product);
  }

  async getSellingProducts() {
    return await this.productRepository.findAllBySellingStatusIn(
      ProductSellingStatus.forDisplay(),
    );
  }
}
