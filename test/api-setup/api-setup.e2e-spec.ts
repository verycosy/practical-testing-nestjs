import { INestApplication } from '@nestjs/common';
import { ApiSetupModule } from 'src/api-setup.module';
import { ApiSetupTestController } from './api-setup-test.controller';
import { createInMemoryTest } from 'test/util/create-in-memory-test';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './test-entity';
import { TestUtil } from 'test/util/test-util';

const { getServer, expectResponse } = TestUtil;

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
    it('규격에 맞게 성공 응답을 반환한다', async () => {
      // given

      // when
      const response = await getServer(app).get('/success');

      // then
      expectResponse(response, 200, {
        statusCode: 200,
        message: '',
        data: 'Hello World!',
        elapsedTime: expect.any(Number),
        responsedAt: expect.any(String),
      });
      expect(response.body.responsedAt).toHaveLength(19);
    });

    it('설정된 상태 코드에 맞게 성공 응답을 반환한다', async () => {
      // given

      // when
      const response = await getServer(app).post('/success');

      // then
      expectResponse(response, 201, {
        statusCode: 201,
        message: '',
        data: 'Hello World!',
      });
    });
  });

  describe('요청 실패 시', () => {
    it('DomainException이면 상태 코드 422로 실패 응답을 반환한다', async () => {
      // given

      // when
      const response = await getServer(app).get('/domain-exception');

      // then
      expectResponse(response, 422, {
        statusCode: 422,
        message: '도메인 예외',
        data: null,
      });
    });

    it('EntityNotFoundError이면 상태 코드 404로 실패 응답을 반환한다', async () => {
      // given

      // when
      const response = await getServer(app).get('/entity-not-found-error');

      // then
      expectResponse(response, 404, {
        statusCode: 404,
        message: '데이터를 찾을 수 없습니다.',
        data: null,
      });
    });

    it('커스텀 Exception이면 상태 코드 500으로 실패 응답을 반환한다', async () => {
      // given

      // when
      const response = await getServer(app).get('/custom-exception');

      // then
      expectResponse(response, 500, {
        statusCode: 500,
        message: 'Something wrong',
        data: null,
      });
    });

    it('HTTP Exception이면 해당 상태 코드로 실패 응답을 반환한다', async () => {
      // given

      // when
      const response = await getServer(app).get('/http-exception');

      // then
      expectResponse(response, 502, {
        statusCode: 502,
        message: 'Just test',
        data: null,
      });
    });
  });

  describe('Validation', () => {
    describe('Query', () => {
      it('성공', async () => {
        // given
        const query = {
          name: '철수',
          age: 30,
          extra: 'test',
        };

        // when
        const response = await getServer(app).get('/validation').query(query);

        // then
        expectResponse(response, 200, {
          statusCode: 200,
          message: '',
          data: query,
        });
      });

      it('성공', async () => {
        // given
        const query = {
          name: '철수',
          age: '30',
        };

        // when
        const response = await getServer(app).get('/validation').query(query);

        // then
        expectResponse(response, 200, {
          statusCode: 200,
          message: '',
          data: {
            name: '철수',
            age: 30,
          },
        });
      });

      it('실패', async () => {
        // given
        const query = {};

        // when
        const response = await getServer(app).get('/validation').query(query);

        // then
        expectResponse(response, 400, {
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
      it('성공', async () => {
        // given
        const body = {
          name: '철수',
          age: 30,
        };

        // when
        const response = await getServer(app).post('/validation').send(body);

        // then
        expectResponse(response, 201, {
          statusCode: 201,
          message: '',
          data: body,
        });
      });

      it('실패', async () => {
        // given

        // when
        const response = await getServer(app).post('/validation');

        // then
        expectResponse(response, 400, {
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
