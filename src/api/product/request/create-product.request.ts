import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString } from 'class-validator';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { IsClassEnum } from 'src/entity/validator/is-class-enum';

export class CreateProductRequest {
  @ApiProperty({
    enum: ProductType.keys(),
  })
  @IsClassEnum(ProductType, {
    message: '상품 타입은 필수입니다.',
  })
  readonly type!: ProductType;

  @ApiProperty({
    enum: ProductSellingStatus.keys(),
  })
  @IsClassEnum(ProductSellingStatus, {
    message: '상품 판매상태는 필수입니다.',
  })
  readonly sellingStatus!: ProductSellingStatus;

  @ApiProperty()
  @IsString({
    message: '상품 이름은 필수입니다.',
  })
  readonly name!: string;

  @ApiProperty()
  @IsPositive({
    message: '상품 가격은 양수여야 합니다.',
  })
  readonly price!: number;
}
