import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule, DBModuleOptions } from './db.module';
import { ProductRepository } from './entity/domain/product/product.repository';
import { OrderRepository } from './entity/domain/order/order.repository';
import { StockRepository } from './entity/domain/stock/stock.repository';
import { MailSendHistoryRepository } from './entity/domain/history/mail/mail-send-history.repository';
import {
  CustomCacheModule,
  CustomCacheModuleOptions,
} from './custom-cache.module';

@Module({})
export class CoreModule {
  static forRoot(
    options: CoreModuleOptions = { useInMemoryDB: false, useRedis: true },
  ): DynamicModule {
    const { useInMemoryDB, useRedis } = options;

    return {
      module: CoreModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CustomCacheModule.forRoot({ useRedis }),
        DBModule.forRoot({
          useInMemoryDB,
          customRepositories: [
            ProductRepository,
            OrderRepository,
            StockRepository,
            MailSendHistoryRepository,
          ],
        }),
      ],
    };
  }
}

type CoreModuleOptions = Pick<DBModuleOptions, 'useInMemoryDB'> &
  CustomCacheModuleOptions;
