import { Injectable } from '@nestjs/common';

@Injectable()
export class MailSendClient {
  async sendEmail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    content: string,
  ): Promise<boolean> {
    console.info('메일 전송');
    return true;
  }
}
