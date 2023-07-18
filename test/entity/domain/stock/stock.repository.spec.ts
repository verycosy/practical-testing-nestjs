import { Stock } from 'src/entity/domain/stock/stock.entity';
import { StockRepository } from 'src/entity/domain/stock/stock.repository';
import { createInMemoryTest } from 'test/util/create-in-memory-test';

describe('StockRepository', () => {
  let stockRepository: StockRepository;

  beforeEach(async () => {
    const module = await createInMemoryTest({}).compile();

    stockRepository = module.get(StockRepository);
  });

  it('상품번호 리스트로 재고를 조회한다.', async () => {
    // given
    const stock1 = Stock.create('001', 1);
    const stock2 = Stock.create('002', 2);
    const stock3 = Stock.create('003', 3);
    await stockRepository.save([stock1, stock2, stock3]);

    // when
    const stocks = await stockRepository.findAllByProductNumberIn([
      '001',
      '002',
    ]);

    // then
    expect(stocks).toHaveLength(2);
    expect(stocks).toMatchObject<Partial<Stock>[]>([
      {
        productNumber: '001',
        quantity: 1,
      },
      {
        productNumber: '002',
        quantity: 2,
      },
    ]);
  });
});
