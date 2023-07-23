import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createInMemoryTest } from 'test/util/create-in-memory-test';
import { DBModule } from 'src/db.module';
import { TestRepository } from './test-repository';
import { TestEntity } from './test-entity';

describe('BaseRepository', () => {
  let testRepository: TestRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createInMemoryTest({
      imports: [
        DBModule.forRoot({
          useInMemoryDB: true,
          customRepositories: [TestRepository],
        }),
        TypeOrmModule.forFeature([TestEntity]),
      ],
    }).compile();

    testRepository = module.get(TestRepository);
  });

  afterEach(async () => {
    await testRepository.clear();
  });

  afterAll(async () => {
    await module.get(DataSource).destroy();
  });

  describe('BaseRepository', () => {
    it('기본 repository 메서드(find, save) 정상 작동', async () => {
      // given
      const sample = new TestEntity('hello');

      // when
      const result = await testRepository.save(sample);

      // then
      expect(result).toMatchObject({
        id: expect.any(String),
        text: 'hello',
      });

      const samples = await testRepository.find();
      expect(samples).toHaveLength(1);
    });

    it('기본 레포지토리 확장 메서드', async () => {
      // given
      const sample1 = new TestEntity('real sample1');
      const sample2 = new TestEntity('real sample2');
      const sample3 = new TestEntity('fake sample1');
      await testRepository.save([sample1, sample2, sample3]);

      // when
      const result = await testRepository.findContainsText('real');

      // then
      expect(result).toHaveLength(2);
    });
  });
});
