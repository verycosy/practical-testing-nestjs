import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CoreModule } from 'src/core.module';
import { ApiSetupModule } from 'src/api-setup.module';
import { ProductApiModule } from 'src/api/product/product-api.module';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ApiSetupModule, ProductApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
