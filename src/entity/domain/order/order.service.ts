import { LocalDateTime } from '@js-joda/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { OrderRepository } from 'src/entity/domain/order/order.repository';
import { ProductType } from 'src/entity/domain/product/product-type';
import { Product } from 'src/entity/domain/product/product.entity';
import { ProductRepository } from 'src/entity/domain/product/product.repository';
import { Stock } from 'src/entity/domain/stock/stock.entity';
import { StockRepository } from 'src/entity/domain/stock/stock.repository';
import { Order } from 'src/entity/domain/order/order.entity';
import { OrderResponse } from '../../../api/order/order.response';

@Injectable()
export class OrderService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  @Transactional()
  async createOrder(
    productNumbers: string[],
    registeredDateTime: LocalDateTime,
  ): Promise<OrderResponse> {
    const products = await this.findProductsBy(productNumbers);
    await this.deductStockQuantities(products);

    const order = Order.create(products, registeredDateTime);
    const savedOrder = await this.orderRepository.save(order);

    return OrderResponse.of(savedOrder);
  }

  private async findProductsBy(productNumbers: string[]) {
    const products = await this.productRepository.findAllByProductNumberIn(
      productNumbers,
    );

    if (!products.length) {
      throw new NotFoundException('상품목록을 찾을 수 없습니다.');
    }

    const productMap = new Map<string, Product>();
    products.forEach((p) => productMap.set(p.productNumber, p));

    return productNumbers.map((v) => productMap.get(v)) as Product[];
  }

  private async deductStockQuantities(products: Product[]) {
    const stockProductNumbers = this.extractStockProductNumbers(products);

    const stockMap = await this.createStockMapBy(stockProductNumbers);
    const productCoutingMap =
      this.createProductCountingMapBy(stockProductNumbers);

    new Set(stockProductNumbers).forEach((stockProductNumber) => {
      const stock = stockMap.get(stockProductNumber);
      const quantity = productCoutingMap.get(stockProductNumber) ?? 0;

      if (!stock || stock.isQuantityLessThan(quantity)) {
        throw new Error('재고가 부족한 상품이 있습니다.');
      }

      stock.deductQuantity(quantity);
    });

    const deductedStocks = Array.from(stockMap, ([, value]) => value);
    await this.stockRepository.save(deductedStocks); // NOTE: JPA처럼 dirty check를 수행하진 않는다.
  }

  private extractStockProductNumbers(products: Product[]) {
    return products
      .filter((product) => ProductType.containsStockType(product.type))
      .map((product) => product.productNumber);
  }

  private async createStockMapBy(stockProductNumbers: string[]) {
    const stocks = await this.stockRepository.findAllByProductNumberIn(
      stockProductNumbers,
    );

    return stocks.reduce<Map<string, Stock>>(
      (acc, cur) => acc.set(cur.productNumber, cur),
      new Map(),
    );
  }

  private createProductCountingMapBy(stockProductNumbers: string[]) {
    return stockProductNumbers.reduce<Map<string, number>>(
      (acc, cur) => acc.set(cur, (acc.get(cur) || 0) + 1),
      new Map(),
    );
  }
}
