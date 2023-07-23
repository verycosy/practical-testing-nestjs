import { Column, Entity, OneToMany } from 'typeorm';
import { OrderStatus } from './order-status';
import { LocalDateTime } from '@js-joda/core';
import { ClassEnumColumn } from 'src/entity/columns/class-enum.column';
import { LocalDateTimeColumn } from 'src/entity/columns/local-date-time.column';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { OrderProduct } from '../order-product/order-product.entity';
import { Product } from '../product/product.entity';

interface CreateOrderParams {
  products: Product[];
  orderStatus: OrderStatus;
  registeredAt: LocalDateTime;
}

@Entity('orders')
export class Order extends BaseTimeEntity {
  @ClassEnumColumn(OrderStatus)
  readonly orderStatus: OrderStatus;

  @Column()
  readonly totalPrice: number;

  @LocalDateTimeColumn()
  readonly registeredAt: LocalDateTime;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  private readonly orderProducts: OrderProduct[];

  constructor(params: CreateOrderParams) {
    super();

    const {
      products,
      orderStatus,
      registeredAt = LocalDateTime.now(),
    } = params;

    this.totalPrice = this.calculateTotalPrice(products);
    this.orderProducts = products.map(
      (product) => new OrderProduct({ order: this, product }),
    );
    this.orderStatus = orderStatus;
    this.registeredAt = registeredAt;
  }

  private calculateTotalPrice(products: Product[]): number {
    return products.reduce((acc, cur) => (acc += cur.price), 0);
  }

  static create(products: Product[], registeredAt: LocalDateTime): Order {
    return new Order({
      orderStatus: OrderStatus.INIT,
      products,
      registeredAt,
    });
  }

  get products() {
    return this.orderProducts.map(({ product }) => product);
  }
}
