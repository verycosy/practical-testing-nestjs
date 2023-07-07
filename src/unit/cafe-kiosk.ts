import { LocalDateTime, LocalTime } from '@js-joda/core';
import { Beverage } from './beverages/beverage';
import { Order } from './order/order';

export class CafeKiosk {
  private static readonly SHOP_OPEN_TIME = LocalTime.of(10, 0);
  private static readonly SHOP_CLOSE_TIME = LocalTime.of(22, 0);
  readonly beverages: Beverage[] = [];

  add(beverage: Beverage, count = 1): void {
    if (count <= 0) {
      throw new Error('음료는 1잔 이상 주문하실 수 있습니다.');
    }

    for (let i = 0; i < count; i++) {
      this.beverages.push(beverage);
    }
  }

  remove(beverage: Beverage): void {
    const idx = this.beverages.findIndex((v) => v === beverage);

    if (idx === -1) {
      return;
    }

    this.beverages.splice(idx);
  }

  clear(): void {
    this.beverages.splice(0, this.beverages.length);
  }

  calculateTotalPrice(): number {
    return this.beverages.reduce((acc, cur) => (acc += cur.price), 0);
  }

  createOrder(currentDateTime = LocalDateTime.now()): Order {
    const currentTime = currentDateTime.toLocalTime();

    if (
      currentTime.isBefore(CafeKiosk.SHOP_OPEN_TIME) ||
      currentTime.isAfter(CafeKiosk.SHOP_CLOSE_TIME)
    ) {
      throw new Error('주문 시간이 아닙니다. 관리자에게 문의하세요.');
    }

    return new Order(currentDateTime, this.beverages);
  }
}
