import { Module } from '@nestjs/common';
import { MailModule } from 'src/common/mail/mail.module';
import { OrderController } from './order.controller';
import { OrderStatisticsService } from './order-statistics.service';
import { OrderModule } from 'src/entity/domain/order/order.module';

@Module({
  imports: [OrderModule, MailModule],
  providers: [OrderStatisticsService],
  controllers: [OrderController],
})
export class OrderApiModule {}
