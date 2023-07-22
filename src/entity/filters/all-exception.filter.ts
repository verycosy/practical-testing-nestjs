import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpResponse } from 'src/api/http.response';

interface HttpExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

// NOTE: ControllerInterceptor로 인해 모든 에러는 HttpException으로 던져짐
@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    this.logger.error(exception, exception.stack);

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const { statusCode, message } =
      exception.getResponse() as HttpExceptionResponse;

    response.status(statusCode).json(
      new HttpResponse({
        statusCode,
        message,
        data: null,
      }),
    );
  }
}
