import { ILike } from 'typeorm';
import { BaseRepository } from 'src/entity/base.repository';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';
import { TestEntity } from './test-entity';
import { Pageable } from 'src/entity/pagination/pageable';

@CustomRepository(TestEntity)
export class TestRepository extends BaseRepository<TestEntity> {
  async findContainsText(text: string) {
    return await this.find({
      where: {
        text: ILike(`%${text}%`),
      },
    });
  }

  async findAllBy(options: Pageable<TestEntity, 'text' | 'createdAt'>) {
    const queryBuilder = this.createQueryBuilder();
    return await this.toPaginate(queryBuilder, options);
  }
}
