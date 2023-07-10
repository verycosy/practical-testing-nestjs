import { LocalDateTime } from '@js-joda/core';
import { Test } from '@nestjs/testing';
import { OrderService } from 'src/api/order/order.service';
import { CoreModule } from 'src/core.module';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { Stock } from 'src/entity/domain/stock/stock.entity';
import { StockRepository } from 'src/entity/domain/stock/stock.repository';

describe('OrderService', () => {
  let orderService: OrderService;
  let productRepository: ProductRepository;
  let stockRepository: StockRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [OrderService],
    }).compile();

    orderService = module.get(OrderService);
    productRepository = module.get(ProductRepository);
    stockRepository = module.get(StockRepository);
  });

  it('상품번호 리스트를 받아 주문을 생성한다.', async () => {
    // given
    const registeredDateTime = LocalDateTime.now();

    const product1 = createProduct(ProductType.HANDMADE, '001', 1000);
    const product2 = createProduct(ProductType.HANDMADE, '002', 3000);
    const product3 = createProduct(ProductType.HANDMADE, '003', 5000);
    await productRepository.save([product1, product2, product3]);

    const productNumbers = ['001', '002'];

    // when
    const orderResponse = await orderService.createOrder(
      productNumbers,
      registeredDateTime,
    );

    // then
    expect(orderResponse).toMatchObject({
      id: expect.any(Number),
      totalPrice: 4000,
      registeredDateTime,
      products: [
        {
          productNumber: '001',
          price: 1000,
        },
        {
          productNumber: '002',
          price: 3000,
        },
      ],
    });
  });

  it('중복되는 상품번호 리스트로 주문을 생성할 수 있다.', async () => {
    // given
    const registeredDateTime = LocalDateTime.now();

    const product1 = createProduct(ProductType.HANDMADE, '001', 1000);
    const product2 = createProduct(ProductType.HANDMADE, '002', 3000);
    const product3 = createProduct(ProductType.HANDMADE, '003', 5000);
    await productRepository.save([product1, product2, product3]);

    const productNumbers = ['001', '001'];

    // when
    const orderResponse = await orderService.createOrder(
      productNumbers,
      registeredDateTime,
    );

    // then
    expect(orderResponse).toMatchObject({
      id: expect.any(Number),
      totalPrice: 2000,
      registeredDateTime,
      products: [
        {
          productNumber: '001',
          price: 1000,
        },
        {
          productNumber: '001',
          price: 1000,
        },
      ],
    });
  });

  it('재고와 관련된 상품이 포함되어 있는 상품번호 리스트를 받아 주문을 생성한다.', async () => {
    // given
    const registeredDateTime = LocalDateTime.now();

    const product1 = createProduct(ProductType.BOTTLE, '001', 1000);
    const product2 = createProduct(ProductType.BAKERY, '002', 3000);
    const product3 = createProduct(ProductType.HANDMADE, '003', 5000);
    await productRepository.save([product1, product2, product3]);

    const stock1 = Stock.create('001', 2);
    const stock2 = Stock.create('002', 2);
    await stockRepository.save([stock1, stock2]);

    const productNumbers = ['001', '001', '002', '003'];

    // when
    const orderResponse = await orderService.createOrder(
      productNumbers,
      registeredDateTime,
    );

    // then
    expect(orderResponse).toMatchObject({
      id: expect.any(Number),
      totalPrice: 10000,
      registeredDateTime: registeredDateTime,
      products: [
        {
          productNumber: '001',
          price: 1000,
        },
        {
          productNumber: '001',
          price: 1000,
        },
        {
          productNumber: '002',
          price: 3000,
        },
        {
          productNumber: '003',
          price: 5000,
        },
      ],
    });

    const stocks = await stockRepository.find();
    expect(stocks).toHaveLength(2);
    expect(stocks).toMatchObject([
      {
        productNumber: '001',
        quantity: 0,
      },
      {
        productNumber: '002',
        quantity: 1,
      },
    ]);
  });

  it('재고가 부족한 상품으로 주문을 생성하는 경우 예외가 발생한다.', async () => {
    // given
    const registeredDateTime = LocalDateTime.now();

    const product1 = createProduct(ProductType.BOTTLE, '001', 1000);
    const product2 = createProduct(ProductType.BAKERY, '002', 3000);
    const product3 = createProduct(ProductType.HANDMADE, '003', 5000);
    await productRepository.save([product1, product2, product3]);

    const stock1 = Stock.create('001', 2);
    const stock2 = Stock.create('002', 2);
    stock1.deductQuantity(1); // NOTE: 안티패턴
    await stockRepository.save([stock1, stock2]);

    const productNumbers = ['001', '001', '002', '003'];

    // when
    const action = () =>
      orderService.createOrder(productNumbers, registeredDateTime);

    // then
    await expect(action).rejects.toThrowError(
      new Error('재고가 부족한 상품이 있습니다.'),
    );
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
});
