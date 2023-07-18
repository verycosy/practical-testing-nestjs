import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { ClassEnumColumn } from 'src/entity/columns/class-enum.column';
import { ProductType } from './product-type';
import { ProductSellingStatus } from './product-selling-status';

@Entity()
export class Product extends BaseTimeEntity {
  @Column()
  readonly productNumber: string;

  @ClassEnumColumn(ProductType)
  readonly type: ProductType;

  @ClassEnumColumn(ProductSellingStatus)
  readonly sellingStatus: ProductSellingStatus;

  @Column()
  readonly name: string;

  @Column()
  readonly price!: number;

  constructor(params: CreateProductParams) {
    super();

    this.productNumber = params.productNumber;
    this.type = params.type;
    this.sellingStatus = params.sellingStatus;
    this.name = params.name;
    this.setPrice(params.price);
  }

  setPrice(newPrice: number) {
    if (newPrice <= 0) {
      throw new Error('상품 가격은 0원보다 커야 합니다.');
    }

    this.mutable.price = newPrice;
  }
}

export interface CreateProductParams {
  productNumber: string;
  type: ProductType;
  sellingStatus: ProductSellingStatus;
  name: string;
  price: number;
}
