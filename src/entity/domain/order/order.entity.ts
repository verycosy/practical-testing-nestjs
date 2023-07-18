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
  registeredDateTime: LocalDateTime;
}

@Entity('orders')
export class Order extends BaseTimeEntity {
  @ClassEnumColumn(OrderStatus)
  readonly orderStatus: OrderStatus;

  @Column()
  readonly totalPrice: number;

  @LocalDateTimeColumn()
  readonly registeredDateTime: LocalDateTime;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  private readonly orderProducts: OrderProduct[];

  constructor(params: CreateOrderParams) {
    super();

    const {
      products,
      orderStatus,
      registeredDateTime = LocalDateTime.now(),
    } = params;

    this.totalPrice = this.calculateTotalPrice(products);
    this.orderProducts = products.map(
      (product) => new OrderProduct({ order: this, product }),
    );
    this.orderStatus = orderStatus;
    this.registeredDateTime = registeredDateTime;
  }

  private calculateTotalPrice(products: Product[]): number {
    return products.reduce((acc, cur) => (acc += cur.price), 0);
  }

  static create(products: Product[], registeredDateTime: LocalDateTime): Order {
    return new Order({
      orderStatus: OrderStatus.INIT,
      products,
      registeredDateTime,
    });
  }

  get products() {
    return this.orderProducts.map(({ product }) => product);
  }
}
