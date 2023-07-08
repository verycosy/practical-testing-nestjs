import { Test, TestingModule } from '@nestjs/testing';
import {
  BadGatewayException,
  Controller,
  Get,
  INestApplication,
  Post,
} from '@nestjs/common';
import * as request from 'supertest';
import { CoreModule } from 'src/core.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from 'src/api/interceptor/api-response.interceptor';
import { ApiSetupModule } from 'src/api-setup.module';

class TestException extends Error {}

@Controller()
class TestController {
  @Get('/success')
  getSuccess() {
    return 'Hello World!';
  }

  @Post('/success')
  postSuccess() {
    return 'Hello World!';
  }

  @Get('/custom-exception')
  customException() {
    throw new TestException('Something wrong');
  }

  @Get('/http-exception')
  httpException() {
    throw new BadGatewayException();
  }
}

describe('TestController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ApiSetupModule],
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
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
          message: 'Bad Gateway',
          data: null,
        });
    });
  });
});
