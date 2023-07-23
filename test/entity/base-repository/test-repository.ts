import { ILike } from 'typeorm';
import { BaseRepository } from 'src/entity/base.repository';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';
import { TestEntity } from './test-entity';

@CustomRepository(TestEntity)
export class TestRepository extends BaseRepository<TestEntity> {
  async findContainsText(text: string) {
    return await this.find({
      where: {
        text: ILike(`%${text}%`),
      },
    });
  }
}
