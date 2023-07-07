import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { ClassEnumColumn } from 'src/entity/columns/class-enum.column';
import { ProductType } from './product-type';
import { ProductSellingStatus } from './product-selling-status';

@Entity()
export class Product extends BaseTimeEntity {
  constructor(params: CreateProductParams) {
    super();
    Object.assign(this, params);
  }

  @Column()
  productNumber: string;

  @ClassEnumColumn(ProductType)
  type: ProductType;

  @ClassEnumColumn(ProductSellingStatus)
  sellingStatus: ProductSellingStatus;

  @Column()
  name: string;

  @Column()
  price: number;
}

interface CreateProductParams {
  productNumber: string;
  type: ProductType;
  sellingStatus: ProductSellingStatus;
  name: string;
  price: number;
}
