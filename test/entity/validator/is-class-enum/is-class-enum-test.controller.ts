import { Body, Controller, Post } from '@nestjs/common';
import { ClassEnumTestRequest } from './class-enum-test.request';

@Controller()
export class IsClassEnumTestController {
  @Post('/')
  validate(@Body() body: ClassEnumTestRequest) {
    return body;
  }
}
