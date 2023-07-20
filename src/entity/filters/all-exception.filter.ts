import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpResponse } from 'src/api/http.response';

interface HttpExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

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

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const { statusCode, message } =
      AllExceptionFilter.getStatusCodeAndMessage(exception);

    response.status(statusCode).json(
      new HttpResponse({
        statusCode,
        message,
        data: null,
      }),
    );
  }
}
