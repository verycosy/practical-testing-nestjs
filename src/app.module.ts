import { Module } from '@nestjs/common';
import { CoreModule } from './core.module';
import { ProductApiModule } from './api/product/product-api.module';
import { ApiSetupModule } from './api-setup.module';
import { OrderApiModule } from './api/order/order-api.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    ApiSetupModule,
    ProductApiModule,
    OrderApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
