import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule, DBModuleOptions } from './db.module';
import { ProductRepository } from './entity/domain/product/product.repository';
import { OrderRepository } from './entity/domain/order/order.repository';
import { StockRepository } from './entity/domain/stock/stock.repository';
import { MailSendHistoryRepository } from './entity/domain/history/mail/mail-send-history.repository';

@Module({})
export class CoreModule {
  static forRoot(
    options: CoreModuleOptions = { useInMemoryDB: false },
  ): DynamicModule {
    const { useInMemoryDB } = options;

    return {
      module: CoreModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
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

interface CoreModuleOptions extends Pick<DBModuleOptions, 'useInMemoryDB'> {}
