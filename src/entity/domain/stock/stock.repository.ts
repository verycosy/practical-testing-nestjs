import { In } from 'typeorm';
import { Stock } from './stock.entity';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';
import { BaseRepository } from 'src/entity/base.repository';

@CustomRepository(Stock)
export class StockRepository extends BaseRepository<Stock> {
  async findAllByProductNumberIn(productNumbers: string[]) {
    return await this.find({
      where: {
        productNumber: In(productNumbers),
      },
    });
  }
}
