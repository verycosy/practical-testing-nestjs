import { CodeName } from 'src/entity/code-name';
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class ProductType extends EnumType<ProductType>() implements CodeName {
  static readonly HANDMADE = new ProductType('HANDMADE', '제조음료');
  static readonly BOTTLE = new ProductType('BOTTLE', '병음료');
  static readonly BAKERY = new ProductType('BAKERY', '베이커리');

  static containsStockType(type: ProductType): boolean {
    return [ProductType.BAKERY, ProductType.BOTTLE].includes(type);
  }

  private constructor(readonly code: string, readonly name: string) {
    super();
  }
}
