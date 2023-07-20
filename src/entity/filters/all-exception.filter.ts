import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpResponse } from 'src/api/http.response';

interface HttpExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  static getStatusCodeAndMessage(err: Error) {
    if (err instanceof HttpException) {
      return err.getResponse() as HttpExceptionResponse;
    }

    return {
      message: err.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  catch(exception: Error, host: ArgumentsHost): void {
    this.logger.error(exception, exception.stack);

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const { statusCode, message } =
      AllExceptionFilter.getStatusCodeAndMessage(exception);
    const responseBody = new HttpResponse({
      statusCode,
      message,
      data: null,
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
