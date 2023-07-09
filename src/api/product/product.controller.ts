import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductRequest } from './request/create-product.request';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProductResponse } from './product.response';

@Controller('/products')
export class ProductController {
  constructor(private readonly productSerivce: ProductService) {}

  @ApiCreatedResponse({
    type: ProductResponse,
  })
  @Post('/')
  async createProduct(@Body() body: CreateProductRequest) {
    return await this.productSerivce.createProduct(body);
  }

  @ApiOkResponse({
    type: [ProductResponse],
  })
  @Get('/selling')
  async getSellingProducts() {
    return await this.productSerivce.getSellingProducts();
  }
}
