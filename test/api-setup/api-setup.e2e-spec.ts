import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiSetupModule } from 'src/api-setup.module';
import { ApiSetupTestController } from './api-setup-test.controller';
import { createInMemoryTest } from 'test/util/create-in-memory-test';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './test-entity';

describe('ApiSetup (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await createInMemoryTest({
      imports: [ApiSetupModule, TypeOrmModule.forFeature([TestEntity])],
      controllers: [ApiSetupTestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(false);
    await app.init();
  });

  describe('요청 성공', () => {
    it('규격에 맞게 성공 응답을 반환한다', () => {
      return request(app.getHttpServer()).get('/success').expect(200).expect({
        statusCode: 200,
        message: '',
        data: 'Hello World!',
      });
    });

    it('설정된 상태 코드에 맞게 성공 응답을 반환한다', () => {
      return request(app.getHttpServer()).post('/success').expect(201).expect({
        statusCode: 201,
        message: '',
        data: 'Hello World!',
      });
    });
  });

  describe('요청 실패 시', () => {
    it('DomainException이면 상태 코드 422로 실패 응답을 반환한다', () => {
      return request(app.getHttpServer())
        .get('/domain-exception')
        .expect(422)
        .expect({
          statusCode: 422,
          message: '도메인 예외',
          data: null,
        });
    });

    it('EntityNotFoundError이면 상태 코드 404로 실패 응답을 반환한다', () => {
      return request(app.getHttpServer())
        .get('/entity-not-found-error')
        .expect(404)
        .expect({
          statusCode: 404,
          message: '데이터를 찾을 수 없습니다.',
          data: null,
        });
    });

    it('커스텀 Exception이면 상태 코드 500으로 실패 응답을 반환한다', () => {
      return request(app.getHttpServer())
        .get('/custom-exception')
        .expect(500)
        .expect({
          statusCode: 500,
          message: 'Something wrong',
          data: null,
        });
    });

    it('HTTP Exception이면 해당 상태 코드로 실패 응답을 반환한다', () => {
      return request(app.getHttpServer())
        .get('/http-exception')
        .expect(502)
        .expect({
          statusCode: 502,
          message: 'Just test',
          data: null,
        });
    });
  });

  describe('Validation', () => {
    describe('Query', () => {
      it('성공', () => {
        const query = {
          name: '철수',
          age: 30,
          extra: 'test',
        };

        return request(app.getHttpServer())
          .get('/validation')
          .query(query)
          .expect(200)
          .expect({
            statusCode: 200,
            message: '',
            data: query,
          });
      });

      it('성공', () => {
        const query = {
          name: '철수',
          age: '30',
        };

        return request(app.getHttpServer())
          .get('/validation')
          .query(query)
          .expect(200)
          .expect({
            statusCode: 200,
            message: '',
            data: {
              name: '철수',
              age: 30,
            },
          });
      });

      it('실패', () => {
        const query = {};

        return request(app.getHttpServer())
          .get('/validation')
          .query(query)
          .expect(400)
          .expect({
            statusCode: 400,
            message: [
              '이름은 문자열이어야 합니다.',
              '나이(age)는 양수이어야 합니다. (입력값 : undefined)',
            ],
            data: null,
          });
      });
    });

    describe('Body', () => {
      it('성공', () => {
        const body = {
          name: '철수',
          age: 30,
        };

        return request(app.getHttpServer())
          .post('/validation')
          .send(body)
          .expect(201)
          .expect({
            statusCode: 201,
            message: '',
            data: body,
          });
      });

      it('실패', () => {
        return request(app.getHttpServer())
          .post('/validation')
          .expect(400)
          .expect({
            statusCode: 400,
            message: [
              '이름은 문자열이어야 합니다.',
              '나이(age)는 양수이어야 합니다. (입력값 : undefined)',
            ],
            data: null,
          });
      });
    });
  });
});
