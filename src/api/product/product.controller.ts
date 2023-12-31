import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from '../../entity/domain/product/product.service';
import { ProductResponse } from './product.response';
import { ApiHttpResponse } from 'src/entity/decorators/api-http-response.decorator';
import * as ProductApiRequest from './request';

@Controller('/products')
export class ProductController {
  constructor(private readonly productSerivce: ProductService) {}

  @ApiHttpResponse({
    type: ProductResponse,
  })
  @Post('/')
  async createProduct(@Body() body: ProductApiRequest.Create) {
    const product = await this.productSerivce.createProduct(body);
    return ProductResponse.of(product);
  }

  @ApiHttpResponse({
    type: ProductResponse,
  })
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: ProductApiRequest.PriceUpdate,
  ) {
    const product = await this.productSerivce.updateProduct(id, body.price);
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
