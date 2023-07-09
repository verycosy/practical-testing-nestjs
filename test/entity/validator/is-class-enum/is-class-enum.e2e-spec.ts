import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ApiSetupModule } from 'src/api-setup.module';
import { IsClassEnumTestController } from './is-class-enum-test.controller';

describe('IsClassEnum (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiSetupModule],
      controllers: [IsClassEnumTestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(false);
    await app.init();
  });

  it('성공', () => {
    const body = {
      status: 'TODO',
      statuses: ['PROGRESS'],
    };

    return request(app.getHttpServer()).post('/').send(body).expect(201);
  });

  describe('실패', () => {
    it('enum 실패', () => {
      const body = {
        status: 'WRONG',
      };

      return request(app.getHttpServer())
        .post('/')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['WRONG는 유효하지 않은 값입니다.'],
          data: null,
        });
    });

    it('enum 실패', () => {
      const body = {
        status: 'WRONG',
        statuses: ['WRONG2', 'TODO'],
      };

      return request(app.getHttpServer())
        .post('/')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'WRONG는 유효하지 않은 값입니다.',
            'WRONG2는 유효하지 않은 값입니다.',
          ],
          data: null,
        });
    });
  });
});
