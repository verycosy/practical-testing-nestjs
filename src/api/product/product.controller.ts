import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from '../../entity/domain/product/product.service';
import { CreateProductRequest } from './request/create-product.request';
import { ProductResponse } from './product.response';
import { ApiHttpResponse } from 'src/entity/decorators/api-http-response.decorator';

@Controller('/products')
export class ProductController {
  constructor(private readonly productSerivce: ProductService) {}

  @ApiHttpResponse({
    type: ProductResponse,
  })
  @Post('/')
  async createProduct(@Body() body: CreateProductRequest) {
    return await this.productSerivce.createProduct(body);
  }

  @ApiHttpResponse({
    type: [ProductResponse],
  })
  @Get('/selling')
  async getSellingProducts() {
    return await this.productSerivce.getSellingProducts();
  }
}
