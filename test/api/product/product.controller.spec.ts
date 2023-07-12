import { instance, mock, reset, when } from '@typestrong/ts-mockito';
import { ProductController } from 'src/api/product/product.controller';
import { ProductResponse } from 'src/api/product/product.response';
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
    const productResponses = [] as ProductResponse[];
    when(productService.getSellingProducts()).thenResolve(productResponses);

    // when
    const result = await productController.getSellingProducts();

    // then
    expect(Array.isArray(result)).toBe(true);
  });
});
