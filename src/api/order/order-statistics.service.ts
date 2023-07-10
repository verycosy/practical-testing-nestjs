import { LocalDate } from '@js-joda/core';
import { Injectable } from '@nestjs/common';
import { MailService } from 'src/api/mail/mail.service';
import { OrderStatus } from 'src/entity/domain/order/order-status';
import { OrderRepository } from 'src/entity/domain/order/order.repository';

@Injectable()
export class OrderStatisticsService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly mailService: MailService,
  ) {}

  async sendOrderStatisticsMail(orderDate: LocalDate, email: string) {
    // TODO: 해당 일자에 결제 완료된 주문들을 가져와서
    const orders = await this.orderRepository.findOrdersBy(
      orderDate.atStartOfDay(),
      orderDate.plusDays(1).atStartOfDay(),
      OrderStatus.PAYMENT_COMPLETED,
    );

    // TODO: 총 매출 합계를 계산하고
    const totalAmount = orders.reduce((acc, cur) => (acc += cur.totalPrice), 0);

    // TODO: 메일 전송
    const result = await this.mailService.sendMail(
      'no-reply@cafekiosk.com',
      email,
      `[매출통계] ${orderDate}`,
      `총 매출 합계는 ${totalAmount}원입니다.`,
    );

    if (!result) {
      throw new Error('매출 통계 메일 전송에 실패했습니다.');
    }

    return true;
  }
}
