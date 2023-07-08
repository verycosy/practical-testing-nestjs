import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/entity/domain/product/product.repository';

@Injectable()
export class ProductNumberFactory {
  constructor(private readonly productRepository: ProductRepository) {}

  async createNextProductNumber() {
    const latestProductNumber =
      await this.productRepository.findLatestProductNumber();

    if (latestProductNumber === null) {
      return '001';
    }

    const nextProductNumber = Number.parseInt(latestProductNumber) + 1;
    return nextProductNumber.toString().padStart(3, '0');
  }
}
