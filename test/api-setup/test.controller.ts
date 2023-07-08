import {
  Controller,
  Get,
  Post,
  BadGatewayException,
  Query,
  Body,
} from '@nestjs/common';
import { TestException } from './test.exception';
import { TestRequest } from './test.request';

@Controller()
export class TestController {
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
    throw new BadGatewayException('Just test');
  }

  @Get('/validation')
  queryValidation(@Query() query: TestRequest) {
    return query;
  }

  @Post('/validation')
  bodyValidation(@Body() body: TestRequest) {
    return body;
  }
}
