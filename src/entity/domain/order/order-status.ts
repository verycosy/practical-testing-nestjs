import { CodeName } from 'src/entity/code-name';
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class OrderStatus extends EnumType<OrderStatus>() implements CodeName {
  static readonly INIT = new OrderStatus('INIT', '주문생성');
  static readonly CANCELED = new OrderStatus('CANCELED', '주문취소');
  static readonly PAYMENT_COMPLETED = new OrderStatus(
    'PAYMENT_COMPLETED',
    '결제완료',
  );
  static readonly PAYMENT_FAILED = new OrderStatus(
    'PAYMENT_FAILED',
    '결제실패',
  );
  static readonly RECEIVED = new OrderStatus('RECEIVED', '주문접수');
  static readonly COMPLETED = new OrderStatus('COMPLETED', '처리완료');

  private constructor(readonly code: string, readonly name: string) {
    super();
  }
}
