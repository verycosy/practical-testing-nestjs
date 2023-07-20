import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';

export class ProductResponse {
  @ApiProperty()
  readonly id!: string;

  @ApiProperty()
  readonly productNumber!: string;

  @Transform(({ value }) => value.code)
  @ApiProperty({
    enum: ProductType.keys(),
  })
  readonly type!: ProductType;

  @Transform(({ value }) => value.code)
  @ApiProperty({
    enum: ProductSellingStatus.keys(),
  })
  readonly sellingStatus!: ProductSellingStatus;

  @ApiProperty()
  readonly name!: string;

  @ApiProperty()
  readonly price!: number;

  private constructor(product: Product) {
    // NOTE: id가 number에서 string으로 바뀌었음에도 에러 감지 X
    // Object.assign(this, product);

    this.id = product.id;
    this.productNumber = product.productNumber;
    this.type = product.type;
    this.sellingStatus = product.sellingStatus;
    this.name = product.name;
    this.price = product.price;
  }

  static of(product: Product) {
    return new ProductResponse(product);
  }
}
