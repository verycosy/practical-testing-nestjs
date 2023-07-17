import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString } from 'class-validator';

export class CreateOrderRequest {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: '상품번호 리스트는 필수입니다.' })
  readonly productNumbers!: string[];
}
