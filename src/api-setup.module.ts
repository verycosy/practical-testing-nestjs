import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { HttpResponseInterceptor } from './entity/interceptor/http-response.interceptor';
import { AllExceptionFilter } from './entity/filters/all-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      inject: [Reflector],
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector),
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],
})
export class ApiSetupModule {}
