import { LocalDateTime } from '@js-joda/core';
import { ProductResponse } from '../product/product.response';
import { Order } from 'src/entity/domain/order/order.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { DateTimeUtil } from 'src/util/date-time-util';

export class OrderResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly totalPrice: number;

  @Transform(({ value }) => DateTimeUtil.toDate(value))
  @ApiProperty({ type: String, format: 'date-time' })
  readonly registeredDateTime: LocalDateTime;

  @ApiProperty({
    type: [ProductResponse],
  })
  readonly products: ProductResponse[];

  private constructor(params: OrderResponse) {
    Object.assign(this, params);
  }

  static of(order: Order) {
    return new OrderResponse({
      id: order.id,
      totalPrice: order.totalPrice,
      registeredDateTime: order.registeredDateTime,
      products: order.orderProducts.map((orderProduct) =>
        ProductResponse.of(orderProduct.product),
      ),
    });
  }
}
