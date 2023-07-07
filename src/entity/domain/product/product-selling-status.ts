import { CodeName } from 'src/entity/code-name';
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class ProductSellingStatus
  extends EnumType<ProductSellingStatus>()
  implements CodeName
{
  static readonly SELLING = new ProductSellingStatus('SELLING', '판매중');
  static readonly HOLD = new ProductSellingStatus('HOLD', '판매보류');
  static readonly STOP_SELLING = new ProductSellingStatus(
    'STOP_SELLING',
    '판매중지',
  );

  static forDisplay(): ProductSellingStatus[] {
    return [this.SELLING, this.HOLD];
  }

  private constructor(readonly code: string, readonly name: string) {
    super();
  }
}
