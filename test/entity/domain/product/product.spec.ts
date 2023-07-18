import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';

describe('Product', () => {
  it('상품 가격은 0원보다 커야 한다', () => {
    // given
    const price = 0;

    // when
    const action = () =>
      new Product({
        price,
        name: '아메리카노',
        productNumber: '001',
        sellingStatus: ProductSellingStatus.HOLD,
        type: ProductType.BAKERY,
      });

    // then
    expect(action).toThrowError(new Error('상품 가격은 0원보다 커야 합니다.'));
  });
});
