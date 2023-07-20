import { In } from 'typeorm';
import { Product } from './product.entity';
import { ProductSellingStatus } from './product-selling-status';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';
import { BaseRepository } from 'src/entity/base.repository';

@CustomRepository(Product)
export class ProductRepository extends BaseRepository<Product> {
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
      `SELECT p.product_number FROM product p ORDER BY p.created_at DESC LIMIT 1`,
    );

    if (result.length) {
      return result[0].product_number;
    }

    return null;
  }
}
