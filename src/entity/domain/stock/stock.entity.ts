import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';

@Entity()
export class Stock extends BaseTimeEntity {
  constructor(source: CreateStockParams) {
    super();
    Object.assign(this, source);
  }

  @Column()
  productNumber: string;

  @Column()
  quantity: number;

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

    this.quantity -= quantity;
  }
}

interface CreateStockParams {
  productNumber: string;
  quantity: number;
}
