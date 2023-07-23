import { LocalDateTime } from '@js-joda/core';
import { OrderStatus } from 'src/entity/domain/order/order-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';
import { Order } from 'src/entity/domain/order/order.entity';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';

describe('Order', () => {
  it('주문 생성 시 상품 리스트에서 주문의 총 금액을 계산한다.', () => {
    // given
    const products = [createProduct('001', 1000), createProduct('002', 2000)];

    // when
    const order = Order.create(products, LocalDateTime.now());

    // then
    expect(order.totalPrice).toBe(3000);
  });

  it('주문 생성 시 주문 상태는 INIT이다.', () => {
    // given
    const products = [createProduct('001', 1000), createProduct('002', 2000)];

    // when
    const order = Order.create(products, LocalDateTime.now());

    // then
    expect(order.orderStatus).toBe(OrderStatus.INIT);
  });

  it('주문 생성 시 주문 등록 시간을 기록한다.', () => {
    // given
    const registeredAt = LocalDateTime.now();
    const products = [createProduct('001', 1000), createProduct('002', 2000)];

    // when
    const order = Order.create(products, registeredAt);

    // then
    expect(registeredAt).toBe(order.registeredAt);
  });

  function createProduct(productNumber: string, price: number) {
    return new Product({
      type: ProductType.HANDMADE,
      productNumber,
      name: '상품이름',
      price,
      sellingStatus: ProductSellingStatus.SELLING,
    });
  }
});
