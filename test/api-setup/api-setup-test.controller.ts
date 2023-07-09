import {
  Controller,
  Get,
  Post,
  BadGatewayException,
  Query,
  Body,
} from '@nestjs/common';
import { ApiSetupTestException } from './api-setup-test.exception';
import { ApiSetupTestRequest } from './api-setup-test.request';

@Controller()
export class ApiSetupTestController {
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
    throw new ApiSetupTestException('Something wrong');
  }

  @Get('/http-exception')
  httpException() {
    throw new BadGatewayException('Just test');
  }

  @Get('/validation')
  queryValidation(@Query() query: ApiSetupTestRequest) {
    return query;
  }

  @Post('/validation')
  bodyValidation(@Body() body: ApiSetupTestRequest) {
    return body;
  }
}
