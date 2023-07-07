import { CafeKiosk } from '../../src/unit/cafe-kiosk';
import { Americano } from '../../src/unit/beverages/americano';
import { Latte } from '../../src/unit/beverages/latte';
import { LocalDateTime } from '@js-joda/core';

describe('CafeKiosk', () => {
  it('음료 1개를 추가하면 주문 목록에 담긴다.', () => {
    const cafeKiosk = new CafeKiosk();

    cafeKiosk.add(new Americano());

    expect(cafeKiosk.beverages).toHaveLength(1);
    expect(cafeKiosk.beverages.at(0)?.name).toBe('아메리카노');
  });

  it('addSeveralBeverages', () => {
    const cafeKiosk = new CafeKiosk();
    const americano = new Americano();

    cafeKiosk.add(americano, 2);

    expect(cafeKiosk.beverages.at(0)).toBe(americano);
    expect(cafeKiosk.beverages.at(1)).toBe(americano);
  });

  it('addZeroBeverages', () => {
    const cafeKiosk = new CafeKiosk();
    const americano = new Americano();

    const action = () => cafeKiosk.add(americano, 0);

    expect(action).toThrowError(
      new Error('음료는 1잔 이상 주문하실 수 있습니다.'),
    );
  });

  it('remove', () => {
    const cafeKiosk = new CafeKiosk();
    const americano = new Americano();

    cafeKiosk.add(americano);
    expect(cafeKiosk.beverages).toHaveLength(1);

    cafeKiosk.remove(americano);
    expect(cafeKiosk.beverages).toHaveLength(0);
  });

  it('clear', () => {
    const cafeKiosk = new CafeKiosk();
    const americano = new Americano();
    const latte = new Latte();

    cafeKiosk.add(americano);
    cafeKiosk.add(latte);
    expect(cafeKiosk.beverages).toHaveLength(2);

    cafeKiosk.clear();
    expect(cafeKiosk.beverages).toHaveLength(0);
  });

  it('주문 목록에 담긴 상품들의 총 금액을 계산할 수 있다.', () => {
    // given
    const cafeKiosk = new CafeKiosk();
    cafeKiosk.add(new Americano());
    cafeKiosk.add(new Latte());

    // when
    const totalPrice = cafeKiosk.calculateTotalPrice();

    // then
    expect(totalPrice).toBe(8500);
  });

  it('createOrderWithCurrentTime', () => {
    const cafeKiosk = new CafeKiosk();
    const americano = new Americano();
    cafeKiosk.add(americano);

    const order = cafeKiosk.createOrder(LocalDateTime.of(2023, 6, 23, 10, 0));

    expect(order.beverages).toHaveLength(1);
    expect(order.beverages.at(0)?.name).toBe('아메리카노');
  });

  it('createOrderOutsideOpenTime', () => {
    const cafeKiosk = new CafeKiosk();
    const americano = new Americano();
    cafeKiosk.add(americano);

    expect(() =>
      cafeKiosk.createOrder(LocalDateTime.of(2023, 6, 23, 9, 59)),
    ).toThrowError(new Error('주문 시간이 아닙니다. 관리자에게 문의하세요.'));
  });
});
