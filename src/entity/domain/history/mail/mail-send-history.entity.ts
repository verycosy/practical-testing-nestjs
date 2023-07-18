import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';

@Entity()
export class MailSendHistory extends BaseTimeEntity {
  @Column()
  readonly fromEmail: string;

  @Column()
  readonly toEmail: string;

  @Column()
  readonly subject: string;

  @Column()
  readonly content: string;

  constructor(params: CreateMailSendHistoryParams) {
    super();

    this.fromEmail = params.fromEmail;
    this.toEmail = params.toEmail;
    this.subject = params.subject;
    this.content = params.content;
  }
}

interface CreateMailSendHistoryParams {
  fromEmail: string;
  toEmail: string;
  subject: string;
  content: string;
}
