import { LocalDateTime } from '@js-joda/core';
import { OrderStatus } from 'src/entity/domain/order/order-status';
import { Order } from 'src/entity/domain/order/order.entity';
import { OrderRepository } from 'src/entity/domain/order/order.repository';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { createInMemoryTest } from 'test/util/create-in-memory-test';

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module = await createInMemoryTest({}).compile();

    orderRepository = module.get(OrderRepository);
    productRepository = module.get(ProductRepository);
  });

  it('원하는 주문일과 상태를 가진 주문들을 조회한다', async () => {
    // given
    const product = new Product({
      name: '아메리카노',
      price: 4000,
      productNumber: '001',
      sellingStatus: ProductSellingStatus.SELLING,
      type: ProductType.HANDMADE,
    });
    await productRepository.save(product);

    const orderStatus = OrderStatus.PAYMENT_FAILED;
    const startDateTime = LocalDateTime.of(2023, 7, 10);
    const endDateTime = LocalDateTime.of(2023, 7, 11);
    const order1 = new Order({
      products: [product],
      orderStatus,
      registeredAt: LocalDateTime.of(2023, 7, 10, 0, 0, 0),
    });
    const order2 = new Order({
      products: [product],
      orderStatus,
      registeredAt: LocalDateTime.of(2023, 7, 11, 0, 0, 0),
    });
    await orderRepository.save([order1, order2]);

    // when
    const result = await orderRepository.findOrdersBy(
      startDateTime,
      endDateTime,
      orderStatus,
    );

    // then
    expect(result).toHaveLength(1);
  });
});
