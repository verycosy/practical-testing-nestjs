import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { createInMemoryTest } from 'test/util/create-in-memory-test';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module = await createInMemoryTest({}).compile();

    productRepository = module.get(ProductRepository);
  });

  it('원하는 판매 상태를 가진 상품들을 조회한다.', async () => {
    // given
    const product1 = createProduct(
      '001',
      ProductType.HANDMADE,
      ProductSellingStatus.SELLING,
      '아메리카노',
      4000,
    );
    const product2 = createProduct(
      '002',
      ProductType.HANDMADE,
      ProductSellingStatus.HOLD,
      '카페라떼',
      4500,
    );
    const product3 = createProduct(
      '003',
      ProductType.HANDMADE,
      ProductSellingStatus.STOP_SELLING,
      '팥빙수',
      7000,
    );
    await productRepository.save([product1, product2, product3]);

    // when
    const products = await productRepository.findAllBySellingStatusIn(
      ProductSellingStatus.forDisplay(),
    );

    // then
    expect(products).toHaveLength(2);
    expect(products).toMatchObject<Partial<Product>[]>([
      {
        productNumber: '001',
        name: '아메리카노',
        sellingStatus: ProductSellingStatus.SELLING,
      },
      {
        productNumber: '002',
        sellingStatus: ProductSellingStatus.HOLD,
      },
    ]);
  });

  it('상품번호 리스트로 상품들을 조회한다.', async () => {
    // given
    const product1 = createProduct(
      '001',
      ProductType.HANDMADE,
      ProductSellingStatus.SELLING,
      '아메리카노',
      4000,
    );
    const product2 = createProduct(
      '002',
      ProductType.HANDMADE,
      ProductSellingStatus.HOLD,
      '카페라떼',
      4500,
    );
    const product3 = createProduct(
      '003',
      ProductType.HANDMADE,
      ProductSellingStatus.STOP_SELLING,
      '팥빙수',
      7000,
    );
    await productRepository.save([product1, product2, product3]);

    // when
    const products = await productRepository.findAllByProductNumberIn([
      '001',
      '002',
    ]);

    // then
    expect(products).toHaveLength(2);
    expect(products).toMatchObject<Partial<Product>[]>([
      {
        productNumber: '001',
        name: '아메리카노',
        sellingStatus: ProductSellingStatus.SELLING,
      },
      {
        productNumber: '002',
        sellingStatus: ProductSellingStatus.HOLD,
      },
    ]);
  });

  it('가장 마지막으로 저장한 상품의 상품번호를 읽어온다.', async () => {
    // given
    const targetProductNumber = '003';

    const product1 = createProduct(
      '001',
      ProductType.HANDMADE,
      ProductSellingStatus.SELLING,
      '아메리카노',
      4000,
    );
    const product2 = createProduct(
      '002',
      ProductType.HANDMADE,
      ProductSellingStatus.HOLD,
      '카페라떼',
      4500,
    );
    const product3 = createProduct(
      targetProductNumber,
      ProductType.HANDMADE,
      ProductSellingStatus.STOP_SELLING,
      '팥빙수',
      7000,
    );
    await productRepository.save([product1, product2, product3]);

    // when
    const latestProductNumber =
      await productRepository.findLatestProductNumber();

    // then
    expect(latestProductNumber).toBe(targetProductNumber);
  });

  it('가장 마지막으로 저장한 상품의 상품번호를 읽어올 때, 상품이 하나도 없는 경우에는 null을 반환한다.', async () => {
    // when
    const latestProductNumber =
      await productRepository.findLatestProductNumber();

    // then
    expect(latestProductNumber).toBeNull();
  });

  function createProduct(
    productNumber: string,
    type: ProductType,
    sellingStatus: ProductSellingStatus,
    name: string,
    price: number,
  ) {
    return new Product({
      productNumber,
      type,
      sellingStatus,
      name,
      price,
    });
  }
});
