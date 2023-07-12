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
    const product = await this.productSerivce.createProduct(body);
    return ProductResponse.of(product);
  }

  @ApiHttpResponse({
    type: [ProductResponse],
  })
  @Get('/selling')
  async getSellingProducts() {
    const products = await this.productSerivce.getSellingProducts();
    return products.map(ProductResponse.of);
  }
}
