import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Stock } from './stock.entity';

@Injectable()
export class StockRepository extends Repository<Stock> {
  constructor(dataSource: DataSource) {
    super(Stock, dataSource.createEntityManager());
  }

  async findAllByProductNumberIn(productNumbers: string[]) {
    return await this.find({
      where: {
        productNumber: In(productNumbers),
      },
    });
  }
}
