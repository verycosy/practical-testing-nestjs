import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailSendClient {
  private readonly logger = new Logger(MailSendClient.name);

  async sendEmail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    content: string,
  ): Promise<boolean> {
    this.logger.debug('메일 전송');
    return true;
  }
}
