import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ApiSetupModule } from 'src/api-setup.module';
import { IsLocalDateTestController } from './is-local-date-test.controller';

describe('IsLocalDate (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiSetupModule],
      controllers: [IsLocalDateTestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(false);
    await app.init();
  });

  it('성공', () => {
    const body = {
      startDate: '2023-07-22',
      dates: ['2023-07-22', '2023-07-29'],
    };

    return request(app.getHttpServer()).post('/').send(body).expect(201);
  });

  describe('실패', () => {
    it('LocalDate 실패', () => {
      const body = {
        startDate: 'WRONG',
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

    it('LocalDate 배열 실패', () => {
      const body = {
        startDate: 'WRONG',
        dates: ['WRONG2', 'TODO'],
      };

      return request(app.getHttpServer())
        .post('/')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'WRONG는 유효하지 않은 값입니다.',
            'WRONG2, TODO는 유효하지 않은 값입니다.',
          ],
          data: null,
        });
    });
  });
});
