import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Column, DataSource, Entity, ILike } from 'typeorm';
import { createInMemoryTest } from 'test/util/create-in-memory-test';
import { DBModule } from 'src/db.module';
import { BaseIdEntity } from 'src/entity/base-id-entity';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';
import { BaseRepository as AbstractBaseRepository } from 'src/entity/base.repository';

@Entity()
class TestEntity extends BaseIdEntity {
  @Column()
  readonly text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }
}

@CustomRepository(TestEntity)
class BaseRepository extends AbstractBaseRepository<TestEntity> {
  async findContainsText(text: string) {
    return await this.find({
      where: {
        text: ILike(`%${text}%`),
      },
    });
  }
}

describe('BaseRepository', () => {
  let baseRepository: BaseRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createInMemoryTest({
      imports: [
        DBModule.forRoot({
          useInMemoryDB: true,
          customRepositories: [BaseRepository],
        }),
        TypeOrmModule.forFeature([TestEntity]),
      ],
    }).compile();

    baseRepository = module.get(BaseRepository);
  });

  afterEach(async () => {
    await baseRepository.clear();
  });

  afterAll(async () => {
    await module.get(DataSource).destroy();
  });

  describe('BaseRepository', () => {
    it('기본 repository 메서드(find, save) 정상 작동', async () => {
      // given
      const sample = new TestEntity('hello');

      // when
      const result = await baseRepository.save(sample);

      // then
      expect(result).toMatchObject({
        id: expect.any(String),
        text: 'hello',
      });

      const samples = await baseRepository.find();
      expect(samples).toHaveLength(1);
    });

    it('기본 레포지토리 확장 메서드', async () => {
      // given
      const sample1 = new TestEntity('real sample1');
      const sample2 = new TestEntity('real sample2');
      const sample3 = new TestEntity('fake sample1');
      await baseRepository.save([sample1, sample2, sample3]);

      // when
      const result = await baseRepository.findContainsText('real');

      // then
      expect(result).toHaveLength(2);
    });
  });
});
