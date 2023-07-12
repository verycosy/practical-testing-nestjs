import { instance, mock, reset, when } from '@typestrong/ts-mockito';
import { ProductController } from 'src/api/product/product.controller';
import { Product } from 'src/entity/domain/product/product.entity';
import { ProductService } from 'src/entity/domain/product/product.service';

describe('ProductController', () => {
  let productController: ProductController;
  const productService = mock(ProductService);

  beforeEach(async () => {
    productController = new ProductController(instance(productService));
  });

  afterEach(() => {
    reset(productService);
  });

  it('판매 상품을 조회한다', async () => {
    // given
    const products = [] as Product[];
    when(productService.getSellingProducts()).thenResolve(products);

    // when
    const result = await productController.getSellingProducts();

    // then
    expect(Array.isArray(result)).toBe(true);
  });
});
