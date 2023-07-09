import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';

export class ProductResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly productNumber: string;

  @Transform(({ value }) => value.code)
  @ApiProperty({
    enum: ProductType.keys(),
  })
  readonly type: ProductType;

  @Transform(({ value }) => value.code)
  @ApiProperty({
    enum: ProductSellingStatus.keys(),
  })
  readonly sellingStatus: ProductSellingStatus;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly price: number;

  private constructor(product: Product) {
    Object.assign(this, product);
  }

  static of(product: Product) {
    return new ProductResponse(product);
  }
}
