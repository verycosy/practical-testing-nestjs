import { And, LessThan, MoreThanOrEqual } from 'typeorm';
import { Order } from './order.entity';
import { LocalDateTime } from '@js-joda/core';
import { OrderStatus } from './order-status';
import { BaseRepository } from 'src/entity/base.repository';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';

@CustomRepository(Order)
export class OrderRepository extends BaseRepository<Order> {
  async findOrdersBy(
    startDateTime: LocalDateTime,
    endDateTime: LocalDateTime,
    orderStatus: OrderStatus,
  ): Promise<Order[]> {
    return await this.find({
      where: {
        registeredAt: And(
          MoreThanOrEqual(startDateTime),
          LessThan(endDateTime),
        ),
        orderStatus,
      },
    });
  }
}
