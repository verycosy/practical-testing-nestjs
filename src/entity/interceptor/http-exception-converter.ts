import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DomainException } from '../exceptions/domain.exception';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class HttpExceptionConverter {
  convert(cause: Error): HttpException {
    if (cause instanceof HttpException) {
      return cause;
    }

    const { message } = cause;
    switch (cause.constructor) {
      case DomainException:
        return new UnprocessableEntityException(message, { cause });

      case EntityNotFoundError: {
        return new NotFoundException('데이터를 찾을 수 없습니다.', { cause });
      }

      default:
        return new InternalServerErrorException(message, { cause });
    }
  }
}
