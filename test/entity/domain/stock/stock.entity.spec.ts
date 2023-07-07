import { Stock } from 'src/entity/domain/stock/stock.entity';

describe('Stock', () => {
  it('재고의 수량이 제공된 수량보다 작은지 확인한다', () => {
    // given
    const stock = Stock.create('001', 1);
    const quantity = 2;

    // when
    const result = stock.isQuantityLessThan(quantity);

    // then
    expect(result).toBe(true);
  });

  it('재고를 주어진 개수만큼 차감할 수 있다', () => {
    // given
    const stock = Stock.create('001', 1);
    const quantity = 1;

    // when
    stock.deductQuantity(quantity);

    // then
    expect(stock.quantity).toBe(0);
  });

  it('재고보다 많은 수량으로 차감 시도하는 경우 예외가 발생한다.', () => {
    // given
    const stock = Stock.create('001', 1);
    const quantity = 2;

    // when
    const action = () => stock.deductQuantity(quantity);

    // then
    expect(action).toThrowError(new Error('차감할 재고 수량이 없습니다.'));
  });
});
