import { Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { Sample } from './sample.entity';

@Injectable()
export class SampleRepository extends Repository<Sample> {
  constructor(private dataSource: DataSource) {
    super(Sample, dataSource.createEntityManager());
  }

  async findContainsText(text: string) {
    return await this.find({
      where: {
        text: ILike(`%${text}%`),
      },
    });
  }
}
