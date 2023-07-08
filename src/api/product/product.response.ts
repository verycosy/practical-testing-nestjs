import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';

export class ProductResponse {
  readonly id: number;
  readonly productNumber: string;
  readonly type: ProductType;
  readonly sellingStatus: ProductSellingStatus;
  readonly name: string;
  readonly price: number;

  private constructor(params: ProductResponse) {
    Object.assign(this, params);
  }

  static of(product: Product) {
    return new ProductResponse(product);
  }
}
