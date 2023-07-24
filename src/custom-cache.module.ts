import { DynamicModule, Module } from '@nestjs/common';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { redisInsStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions, RedisClientType } from 'redis';
import { REDIS_CLIENT, RedisModule } from './infra/redis/redis.module';
import { StoreConfig } from 'cache-manager';

@Module({})
export class CustomCacheModule {
  static forRoot(
    options: CustomCacheModuleOptions = { useRedis: true },
  ): DynamicModule {
    const cacheOptions: CacheModuleOptions<StoreConfig> = {
      isGlobal: true,
    };

    const cacheModule = options.useRedis
      ? CacheModule.registerAsync<RedisClientOptions>({
          imports: [RedisModule],
          inject: [REDIS_CLIENT],
          useFactory: (redis: RedisClientType) => ({
            ...cacheOptions,
            store: redisInsStore(redis),
          }),
        })
      : CacheModule.register(cacheOptions);

    return {
      module: CustomCacheModule,
      imports: [cacheModule],
    };
  }
}

export interface CustomCacheModuleOptions {
  useRedis: boolean;
}
