import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiSetupModule } from 'src/api-setup.module';
import { OrderApiModule } from 'src/api/order/order-api.module';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { createInMemoryTest } from 'test/util/create-in-memory-test';

describe('OrderController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await createInMemoryTest({
      imports: [ApiSetupModule, OrderApiModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('신규 주문을 등록한다', async () => {
    // given
    const productNumber = '001';
    await createProduct(app, productNumber);
    const body = {
      productNumbers: [productNumber],
    };

    // when // then
    return request(app.getHttpServer()).post('/orders').send(body).expect(201);
  });

  it('신규 주문을 등록할 때 상품번호는 1개 이상이어야 한다', () => {
    // given
    const body = {
      productNumbers: [],
    };

    // when // then
    return request(app.getHttpServer())
      .post('/orders')
      .send(body)
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['상품번호 리스트는 필수입니다.'],
        data: null,
      });
  });
});

const createProduct = async (app: INestApplication, productNumber: string) => {
  const productRepository = app.get(ProductRepository);
  const product = new Product({
    productNumber,
    type: ProductType.HANDMADE,
    sellingStatus: ProductSellingStatus.SELLING,
    name: '아메리카노',
    price: 4000,
  });

  await productRepository.save(product);
};
