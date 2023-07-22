import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { ApiSetupModule } from 'src/api-setup.module';
import { IsLocalDateTestController } from './is-local-date-test.controller';
import { TestUtil } from 'test/util/test-util';

const { getServer, expectResponse } = TestUtil;

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

  it('성공', async () => {
    // given
    const body = {
      startDate: '2023-07-22',
      dates: ['2023-07-22', '2023-07-29'],
    };

    // when
    const response = await getServer(app).post('/').send(body);

    // then
    expectResponse(response, 201);
  });

  describe('실패', () => {
    it('LocalDate 실패', async () => {
      // given
      const body = {
        startDate: 'WRONG',
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

    it('LocalDate 배열 실패', async () => {
      // given
      const body = {
        startDate: 'WRONG',
        dates: ['WRONG2', 'TODO'],
      };

      // when
      const response = await getServer(app).post('/').send(body);

      // then
      expectResponse(response, 400, {
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
