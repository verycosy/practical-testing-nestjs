import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequest } from './request/create-order.request';
import { LocalDateTime } from '@js-joda/core';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { OrderResponse } from './order.response';

@ApiTags('주문')
@Controller('/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiCreatedResponse({
    type: OrderResponse,
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
