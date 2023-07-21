import { PickType } from '@nestjs/swagger';
import { ProductCreateRequest } from './product-create.request';

export class ProductPriceUpdateRequest extends PickType(ProductCreateRequest, [
  'price',
] as const) {}
