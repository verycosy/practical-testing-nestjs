import { LocalDateTime } from '@js-joda/core';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { DateTimeUtil } from 'src/util/date-time-util';

export class HttpResponse<T> {
  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty({
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
    description: '문자열 혹은 문자열 배열',
  })
  readonly message: string | string[];

  @ApiProperty()
  readonly elapsedTime: number;

  readonly data: T | null;

  constructor(params: Omit<HttpResponse<T>, 'responsedAt'>) {
    this.statusCode = params.statusCode;
    this.data = params.data;
    this.message = params.message;
    this.elapsedTime = params.elapsedTime;
  }

  @ApiProperty({
    type: String,
    example: 'yyyy-MM-dd HH:mm:ss',
  })
  @Transform(({ value }) => DateTimeUtil.toString(value)) // TODO: 유틸 함수 따로 만들기
  @Expose()
  get responsedAt() {
    return LocalDateTime.now();
  }
}
