import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiSetupModule } from 'src/api-setup.module';
import { ProductApiModule } from 'src/api/product/product-api.module';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { createInMemoryTest } from 'test/util/create-in-memory-test';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { Product } from 'src/entity/domain/product/product.entity';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await createInMemoryTest({
      imports: [ApiSetupModule, ProductApiModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('신규 상품 등록', () => {
    it('등록된 신규 상품을 반환한다', () => {
      // given
      const body = {
        type: ProductType.HANDMADE.code,
        sellingStatus: ProductSellingStatus.SELLING.code,
        name: '아메리카노',
        price: 4000,
      };

      // when // then
      return request(app.getHttpServer())
        .post('/products')
        .send(body)
        .expect(201);
    });

    it('상품 타입은 필수값이다.', () => {
      // given
      const body = {
        sellingStatus: ProductSellingStatus.SELLING.code,
        name: '아메리카노',
        price: 4000,
      };

      // when // then
      return request(app.getHttpServer())
        .post('/products')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['상품 타입은 필수입니다.'],
          data: null,
        });
    });

    it('상품 판매상태는 필수값이다.', () => {
      // given
      const body = {
        type: ProductType.HANDMADE.code,
        name: '아메리카노',
        price: 4000,
      };

      // when // then
      return request(app.getHttpServer())
        .post('/products')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['상품 판매상태는 필수입니다.'],
          data: null,
        });
    });

    it('상품 이름은 필수값이다.', () => {
      // given
      const body = {
        type: ProductType.HANDMADE.code,
        sellingStatus: ProductSellingStatus.SELLING.code,
        price: 4000,
      };

      // when // then
      return request(app.getHttpServer())
        .post('/products')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['상품 이름은 필수입니다.'],
          data: null,
        });
    });

    it('상품 가격은 양수이다.', () => {
      // given
      const body = {
        type: ProductType.HANDMADE.code,
        sellingStatus: ProductSellingStatus.SELLING.code,
        name: '아메리카노',
        price: 0,
      };

      // when // then
      return request(app.getHttpServer())
        .post('/products')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['상품 가격은 양수여야 합니다.'],
          data: null,
        });
    });
  });

  it('상품 가격을 수정한다', async () => {
    // given
    const { id } = await createProduct(app, '001', 4000);
    const newPrice = 1000;
    const body = {
      price: newPrice,
    };

    // when // then
    const {
      body: { data },
      statusCode,
    } = await request(app.getHttpServer()).patch(`/products/${id}`).send(body);

    expect(statusCode).toBe(200);
    expect(data.price).toBe(newPrice);
  });

  it('판매 상품을 조회한다', () => {
    return request(app.getHttpServer())
      .get('/products/selling')
      .expect(200)
      .expect({
        statusCode: 200,
        message: '',
        data: [],
      });
  });
});

const createProduct = async (
  app: INestApplication,
  productNumber: string,
  price: number,
) => {
  const productRepository = app.get(ProductRepository);
  const product = new Product({
    productNumber,
    type: ProductType.HANDMADE,
    sellingStatus: ProductSellingStatus.SELLING,
    name: '아메리카노',
    price,
  });

  return await productRepository.save(product);
};
