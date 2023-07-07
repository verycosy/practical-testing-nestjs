import { LocalDateTime } from '@js-joda/core';
import { Beverage } from '../beverages/beverage';

export class Order {
  constructor(
    readonly orderDateTime: LocalDateTime,
    readonly beverages: Beverage[],
  ) {}
}
