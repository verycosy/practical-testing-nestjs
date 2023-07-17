import { Entity, ManyToOne } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';

@Entity()
export class OrderProduct extends BaseTimeEntity {
  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  constructor(params: CreateOrderProductParams) {
    super();

    this.order = params.order;
    this.product = params.product;
  }
}

interface CreateOrderProductParams {
  order: Order;
  product: Product;
}
