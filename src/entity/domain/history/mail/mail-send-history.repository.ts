import { DataSource, Repository } from 'typeorm';
import { MailSendHistory } from './mail-send-history.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailSendHistoryRepository extends Repository<MailSendHistory> {
  constructor(dataSource: DataSource) {
    super(MailSendHistory, dataSource.createEntityManager());
  }
}
