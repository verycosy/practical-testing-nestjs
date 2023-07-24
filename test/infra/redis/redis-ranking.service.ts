import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '../../../src/infra/redis/redis.module';

@Injectable()
export class RedisRankingService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
  ) {}

  async addScore(key: string, score: number, member: string) {
    return await this.redisClient.ZADD(key, {
      score,
      value: member,
    });
  }

  async getScore(key: string, member: string) {
    return await this.redisClient.ZSCORE(key, member);
  }

  async getRanking(key: string, min: number, max: number) {
    return await this.redisClient.ZRANGE(key, min, max, {
      REV: true,
    });
  }

  async getRankOfMember(key: string, member: string) {
    return await this.redisClient.ZREVRANK(key, member);
  }
}
