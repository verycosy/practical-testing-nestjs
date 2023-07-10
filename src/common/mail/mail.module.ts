import { Module } from '@nestjs/common';
import { MailSendClient } from './mail-send-client';
import { MailService } from './mail.service';

@Module({
  providers: [MailSendClient, MailService],
  exports: [MailService],
})
export class MailModule {}
