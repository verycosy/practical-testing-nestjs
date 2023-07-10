import { Module } from '@nestjs/common';
import { MailModule } from 'src/common/mail/mail.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderStatisticsService } from './order-statistics.service';

@Module({
  imports: [MailModule],
  controllers: [OrderController],
  providers: [OrderService, OrderStatisticsService],
})
export class OrderApiModule {}
