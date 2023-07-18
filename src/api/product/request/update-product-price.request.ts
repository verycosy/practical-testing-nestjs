import { PickType } from '@nestjs/swagger';
import { CreateProductRequest } from './create-product.request';

export class UpdateProductPriceRequest extends PickType(CreateProductRequest, [
  'price',
] as const) {}
