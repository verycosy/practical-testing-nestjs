// NOTE: redis client가 정상적으로 작동하는지 확인용 테스트

import { Test } from '@nestjs/testing';
import { REDIS_CLIENT, RedisModule } from 'src/infra/redis/redis.module';
import { RedisRankingService } from './redis-ranking.service';
import { ConfigModule } from '@nestjs/config';
import type { RedisClientType } from 'redis';

describe('RedisRankingService', () => {
  let redisRankingService: RedisRankingService;
  let redisClient: RedisClientType;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        RedisModule,
      ],
      providers: [RedisRankingService],
    }).compile();

    redisRankingService = module.get(RedisRankingService);
    redisClient = module.get(REDIS_CLIENT);
  });

  afterEach(async () => {
    await redisClient.flushAll();
    await redisClient.disconnect();
  });

  it('점수 등록', async () => {
    // given
    const listName = '수학';
    const score = 86;
    const memberName = '민수';

    // when
    const result = await redisRankingService.addScore(
      listName,
      score,
      memberName,
    );

    // then
    expect(result).toBe(1);
  });

  it('점수 불러오기', async () => {
    // given
    const listName = '수학';
    const score = 86;
    const memberName = '민수';
    await redisClient.ZADD(listName, { value: memberName, score });

    // when
    const result = await redisRankingService.getScore(listName, memberName);

    // then
    expect(result).toBe(score);
  });

  it('전체 랭킹', async () => {
    // given
    const listName = '수학';
    await redisClient.ZADD(listName, [
      { value: '민수', score: 86 },
      { value: '철수', score: 70 },
      { value: '팽수', score: 90 },
    ]);

    // when
    const result = await redisRankingService.getRanking(listName, 0, -1);

    // then
    expect(result).toEqual(['팽수', '민수', '철수']);
  });

  it('개별 랭킹', async () => {
    // given
    const listName = '수학';
    await redisClient.ZADD(listName, [
      { value: '민수', score: 86 },
      { value: '철수', score: 70 },
      { value: '팽수', score: 90 },
    ]);

    // when
    const result = await redisRankingService.getRankOfMember(listName, '팽수');

    // then
    expect(result).toBe(0);
  });
});
