import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiSetupModule } from 'src/api-setup.module';
import { IsClassEnumTestController } from './is-class-enum-test.controller';
import { TestUtil } from 'test/util/test-util';

const { getServer, expectResponse } = TestUtil;

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

  it('성공', async () => {
    // given
    const body = {
      status: 'TODO',
      statuses: ['PROGRESS'],
    };

    // when
    const response = await getServer(app).post('/').send(body);

    // then
    expectResponse(response, 201);
  });

  describe('실패', () => {
    it('enum 실패', async () => {
      // given
      const body = {
        status: 'WRONG',
      };

      // when
      const response = await getServer(app).post('/').send(body);

      // then
      expectResponse(response, 400, {
        statusCode: 400,
        message: ['WRONG는 유효하지 않은 값입니다.'],
        data: null,
      });
    });

    it('enum 배열 실패', async () => {
      // given
      const body = {
        status: 'WRONG',
        statuses: ['WRONG2', 'TODO'],
      };

      // when
      const response = await getServer(app).post('/').send(body);

      // then
      expectResponse(response, 400, {
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
