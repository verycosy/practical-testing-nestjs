import { ILike } from 'typeorm';
import { Sample } from './sample.entity';
import { BaseRepository } from 'src/entity/base.repository';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';

@CustomRepository(Sample)
export class SampleRepository extends BaseRepository<Sample> {
  async findContainsText(text: string) {
    return await this.find({
      where: {
        text: ILike(`%${text}%`),
      },
    });
  }
}
