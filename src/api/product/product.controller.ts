import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('/products')
export class ProductController {
  constructor(private readonly productSerivce: ProductService) {}

  @Get('/selling')
  async getSellingProducts() {
    return await this.productSerivce.getSellingProducts();
  }
}
