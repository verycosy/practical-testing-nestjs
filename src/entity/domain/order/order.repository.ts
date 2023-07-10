import { Injectable } from '@nestjs/common';
import {
  And,
  DataSource,
  LessThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Order } from './order.entity';
import { LocalDateTime } from '@js-joda/core';
import { OrderStatus } from './order-status';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  // TODO: 테스트 작성
  async findOrdersBy(
    startDateTime: LocalDateTime,
    endDateTime: LocalDateTime,
    orderStatus: OrderStatus,
  ): Promise<Order[]> {
    return await this.find({
      where: {
        registeredDateTime: And(
          MoreThanOrEqual(startDateTime),
          LessThan(endDateTime),
        ),
        orderStatus,
      },
    });
  }
}
