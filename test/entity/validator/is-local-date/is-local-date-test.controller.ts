import { Body, Controller, Post } from '@nestjs/common';
import { LocalDateTestRequest } from './local-date-test.request';

@Controller()
export class IsLocalDateTestController {
  @Post('/')
  validate(@Body() body: LocalDateTestRequest) {
    return body;
  }
}
