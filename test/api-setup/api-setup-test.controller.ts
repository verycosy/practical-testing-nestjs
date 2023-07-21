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
import { DomainException } from 'src/entity/exceptions/domain.exception';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TestEntity } from './test-entity';
import { v4 } from 'uuid';

@Controller()
export class ApiSetupTestController {
  constructor(
    @InjectRepository(TestEntity)
    private readonly repository: Repository<TestEntity>,
  ) {}

  @Get('/success')
  getSuccess() {
    return 'Hello World!';
  }

  @Post('/success')
  postSuccess() {
    return 'Hello World!';
  }

  @Get('/entity-not-found-error')
  async entityNotFoundError() {
    await this.repository.findOneOrFail({
      where: {
        id: v4(),
      },
    });
  }

  @Get('/domain-exception')
  domainException() {
    throw new DomainException('도메인 예외');
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
