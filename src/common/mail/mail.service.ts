import { Injectable } from '@nestjs/common';
import { MailSendClient } from 'src/common/mail/mail-send-client';
import { MailSendHistory } from 'src/entity/domain/history/mail/mail-send-history.entity';
import { MailSendHistoryRepository } from 'src/entity/domain/history/mail/mail-send-history.repository';

@Injectable()
export class MailService {
  constructor(
    private readonly mailSendClient: MailSendClient,
    private readonly mailSendHistoryRepository: MailSendHistoryRepository,
  ) {}

  async sendMail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    content: string,
  ): Promise<boolean> {
    const result = await this.mailSendClient.sendEmail(
      fromEmail,
      toEmail,
      subject,
      content,
    );

    if (result) {
      await this.mailSendHistoryRepository.save(
        new MailSendHistory({
          fromEmail,
          toEmail,
          subject,
          content,
        }),
      );

      return true;
    }

    return false;
  }
}
