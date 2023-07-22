import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from 'src/api/http.response';
import { HttpExceptionConverter } from './http-exception-converter';

@Injectable()
export class ControllerInterceptor<T>
  implements NestInterceptor<T, HttpResponse<T | null>>
{
  private readonly logger = new Logger(ControllerInterceptor.name);

  constructor(
    private readonly httpExceptionConverter: HttpExceptionConverter,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<HttpResponse<T | null>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map(
        (data) =>
          new HttpResponse({
            statusCode: response.statusCode,
            message: '',
            data,
          }),
      ),
      catchError((cause: Error) => {
        this.logger.error(cause, cause.stack);

        const httpException = this.httpExceptionConverter.convert(cause);
        const { statusCode, message } =
          httpException.getResponse() as HttpExceptionResponse;

        response.status(statusCode);
        return of(
          new HttpResponse({
            statusCode,
            message,
            data: null,
          }),
        );
      }),
    );
  }
}

interface HttpExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
