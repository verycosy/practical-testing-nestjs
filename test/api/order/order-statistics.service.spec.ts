import { LocalDate, LocalDateTime } from '@js-joda/core';
import { anyString, instance, mock, reset, when } from '@typestrong/ts-mockito';
import { OrderStatisticsService } from 'src/api/order/order-statistics.service';
import { MailSendClient } from 'src/common/mail/mail-send-client';
import { MailSendHistory } from 'src/entity/domain/history/mail/mail-send-history.entity';
import { MailSendHistoryRepository } from 'src/entity/domain/history/mail/mail-send-history.repository';
import { OrderStatus } from 'src/entity/domain/order/order-status';
import { Order } from 'src/entity/domain/order/order.entity';
import { OrderRepository } from 'src/entity/domain/order/order.repository';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { MailModule } from 'src/common/mail/mail.module';
import { createInMemoryTest } from 'test/util/create-in-memory-test';

describe('OrderStatisticsService', () => {
  let orderStatisticsService: OrderStatisticsService;
  let orderRepository: OrderRepository;
  let productRepository: ProductRepository;
  let mailSendHistoryRepository: MailSendHistoryRepository;
  const mailSendClient = mock(MailSendClient);

  beforeEach(async () => {
    const module = await createInMemoryTest({
      imports: [MailModule],
      providers: [OrderStatisticsService],
    })
      .overrideProvider(MailSendClient)
      .useValue(instance(mailSendClient))
      .compile();

    orderStatisticsService = module.get(OrderStatisticsService);
    productRepository = module.get(ProductRepository);
    orderRepository = module.get(OrderRepository);
    mailSendHistoryRepository = module.get(MailSendHistoryRepository);

    reset(mailSendClient);
  });

  it('결제완료 주문들을 조회하여 매출 통계 메일을 전송한다.', async () => {
    // given
    const now = LocalDateTime.of(2023, 3, 5, 0, 0);

    const product1 = createProduct(ProductType.HANDMADE, '001', 1000);
    const product2 = createProduct(ProductType.HANDMADE, '002', 2000);
    const product3 = createProduct(ProductType.HANDMADE, '003', 3000);
    const products = [product1, product2, product3];
    await productRepository.save(products);

    await createPaymentCompletedOrder(
      LocalDateTime.of(2023, 3, 4, 23, 59, 59),
      products,
    );
    await createPaymentCompletedOrder(now, products);
    await createPaymentCompletedOrder(
      LocalDateTime.of(2023, 3, 5, 23, 59, 59),
      products,
    );
    await createPaymentCompletedOrder(
      LocalDateTime.of(2023, 3, 6, 0, 0),
      products,
    );

    // stubbing
    when(
      mailSendClient.sendEmail(
        anyString(),
        anyString(),
        anyString(),
        anyString(),
      ),
    ).thenResolve(true);

    // when
    const result = await orderStatisticsService.sendOrderStatisticsMail(
      LocalDate.of(2023, 3, 5),
      'test@test.com',
    );

    // then
    expect(result).toBe(true);

    const histories = await mailSendHistoryRepository.find();
    expect(histories).toHaveLength(1);
    expect(histories).toMatchObject<Partial<MailSendHistory>[]>([
      {
        content: '총 매출 합계는 12000원입니다.',
      },
    ]);
  });

  function createProduct(
    type: ProductType,
    productNumber: string,
    price: number,
  ) {
    return new Product({
      type,
      productNumber,
      name: '상품이름',
      price,
      sellingStatus: ProductSellingStatus.SELLING,
    });
  }

  async function createPaymentCompletedOrder(
    now: LocalDateTime,
    products: Product[],
  ) {
    const order = new Order({
      products,
      registeredDateTime: now,
      orderStatus: OrderStatus.PAYMENT_COMPLETED,
    });

    return await orderRepository.save(order);
  }
});
