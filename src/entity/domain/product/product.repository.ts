import { DataSource, In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { Injectable } from '@nestjs/common';
import { ProductSellingStatus } from './product-selling-status';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async findAllBySellingStatusIn(
    sellingStatuses: ProductSellingStatus[],
  ): Promise<Product[]> {
    return await this.find({
      where: {
        sellingStatus: In(sellingStatuses),
      },
    });
  }

  async findAllByProductNumberIn(productNumbers: string[]) {
    return await this.find({
      where: {
        productNumber: In(productNumbers),
      },
    });
  }

  async findLatestProductNumber() {
    const result = await this.manager.query<{ product_number: string }[]>(
      `SELECT p.product_number FROM product p ORDER BY id DESC LIMIT 1`,
    );

    if (result.length) {
      return result[0].product_number;
    }

    return null;
  }
}
