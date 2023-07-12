import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  constructor(params: ApiResponse<T>) {
    Object.assign(this, params);
  }

  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string | string[];

  @ApiProperty()
  readonly data: T | null;
}
