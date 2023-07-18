import { ProductService } from 'src/entity/domain/product/product.service';
import { ProductNumberFactory } from 'src/entity/domain/product/product-number-factory';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { ProductType } from 'src/entity/domain/product/product-type';
import { ProductSellingStatus } from 'src/entity/domain/product/product-selling-status';
import { Product } from 'src/entity/domain/product/product.entity';
import { createInMemoryTest } from 'test/util/create-in-memory-test';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module = await createInMemoryTest({
      providers: [ProductService, ProductNumberFactory],
    }).compile();

    productService = module.get(ProductService);
    productRepository = module.get(ProductRepository);
  });

  it('상품이 하나도 없는 경우 신규 상품을 등록하면 상품번호는 001이다', async () => {
    // given
    const request = {
      type: ProductType.HANDMADE,
      sellingStatus: ProductSellingStatus.SELLING,
      name: '카푸치노',
      price: 5000,
    };

    // when
    const productResponse = await productService.createProduct(request);

    // then
    expect(productResponse).toMatchObject({
      productNumber: '001',
      type: ProductType.HANDMADE,
      sellingStatus: ProductSellingStatus.SELLING,
      name: '카푸치노',
      price: 5000,
    });

    const products = await productRepository.find({ order: { id: 'ASC' } });
    expect(products).toMatchObject<Partial<Product>[]>([
      {
        id: expect.any(Number),
        productNumber: '001',
        type: ProductType.HANDMADE,
        sellingStatus: ProductSellingStatus.SELLING,
        name: '카푸치노',
        price: 5000,
      },
    ]);
  });

  it('신규 상품을 등록한다. 상품번호는 가장 최근 상품의 상품번호에서 1 증가한 값이다.', async () => {
    // given
    const product = createProduct(
      '001',
      ProductType.HANDMADE,
      ProductSellingStatus.SELLING,
      '아메리카노',
      4000,
    );
    await productRepository.save(product);

    const request = {
      type: ProductType.HANDMADE,
      sellingStatus: ProductSellingStatus.SELLING,
      name: '카푸치노',
      price: 5000,
    };

    // when
    const productResponse = await productService.createProduct(request);

    // then
    expect(productResponse).toMatchObject({
      productNumber: '002',
      type: ProductType.HANDMADE,
      sellingStatus: ProductSellingStatus.SELLING,
      name: '카푸치노',
      price: 5000,
    });

    const products = await productRepository.find({ order: { id: 'ASC' } });
    expect(products).toMatchObject<Partial<Product>[]>([
      {
        id: expect.any(Number),
        productNumber: '001',
        type: ProductType.HANDMADE,
        sellingStatus: ProductSellingStatus.SELLING,
        name: '아메리카노',
        price: 4000,
      },
      {
        id: expect.any(Number),
        productNumber: '002',
        type: ProductType.HANDMADE,
        sellingStatus: ProductSellingStatus.SELLING,
        name: '카푸치노',
        price: 5000,
      },
    ]);
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
