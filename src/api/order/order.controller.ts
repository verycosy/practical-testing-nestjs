import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from '../../entity/domain/order/order.service';
import { CreateOrderRequest } from './request/create-order.request';
import { LocalDateTime } from '@js-joda/core';
import { ApiTags } from '@nestjs/swagger';
import { OrderResponse } from './order.response';
import { ApiHttpResponse } from 'src/entity/decorators/api-http-response.decorator';

@ApiTags('주문')
@Controller('/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiHttpResponse({
    type: OrderResponse,
  })
  @ApiHttpResponse({
    status: 404,
    type: String,
    description: '주문할 상품 목록을 찾을 수 없음',
  })
  @Post('/')
  async createOrder(@Body() { productNumbers }: CreateOrderRequest) {
    const registeredDateTime = LocalDateTime.now();

    return await this.orderService.createOrder(
      productNumbers,
      registeredDateTime,
    );
  }
}
