import { Entity, ManyToOne } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';

@Entity()
export class OrderProduct extends BaseTimeEntity {
  constructor(params: CreateOrderProductParams) {
    super();
    Object.assign(this, params);
  }

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;
}

interface CreateOrderProductParams {
  order: Order;
  product: Product;
}
