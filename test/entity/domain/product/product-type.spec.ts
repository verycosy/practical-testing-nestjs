import { ProductType } from 'src/entity/domain/product/product-type';

describe('ProductType', () => {
  describe('상품 타입이 재고 관련 타입인지를 체크한다.', () => {
    it.each([
      [ProductType.HANDMADE, false],
      [ProductType.BAKERY, true],
      [ProductType.BOTTLE, true],
    ])('%s는 %s', (productType, expected) => {
      const result = ProductType.containsStockType(productType);

      expect(result).toBe(expected);
    });
  });
});
