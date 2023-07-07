import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';

@Entity()
export class MailSendHistory extends BaseTimeEntity {
  constructor(input: CreateMailSendHistoryParams) {
    super();
    Object.assign(this, input);
  }

  @Column()
  fromEmail: string;

  @Column()
  toEmail: string;

  @Column()
  subject: string;

  @Column()
  content: string;
}

interface CreateMailSendHistoryParams {
  fromEmail: string;
  toEmail: string;
  subject: string;
  content: string;
}
