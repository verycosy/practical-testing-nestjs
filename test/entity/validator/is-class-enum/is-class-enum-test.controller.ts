import { Body, Controller, Post } from '@nestjs/common';
import { ClassEnumRequest } from './class-enum.request';

@Controller()
export class IsClassEnumTestController {
  @Post('/')
  validate(@Body() body: ClassEnumRequest) {
    return body;
  }
}
