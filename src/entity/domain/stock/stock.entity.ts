import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';

@Entity()
export class Stock extends BaseTimeEntity {
  @Column()
  readonly productNumber: string;

  @Column()
  readonly quantity: number;

  constructor(params: CreateStockParams) {
    super();

    this.productNumber = params.productNumber;
    this.quantity = params.quantity;
  }

  static create(productNumber: string, quantity: number) {
    return new Stock({ productNumber, quantity });
  }

  isQuantityLessThan(quantity: number): boolean {
    return this.quantity < quantity;
  }

  deductQuantity(quantity: number) {
    if (this.isQuantityLessThan(quantity)) {
      throw new Error('차감할 재고 수량이 없습니다.');
    }

    this.mutable.quantity -= quantity;
  }
}

interface CreateStockParams {
  productNumber: string;
  quantity: number;
}
