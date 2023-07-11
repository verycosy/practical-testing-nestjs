import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';
import { BaseRepository } from 'src/entity/base.repository';
import { MailSendHistory } from './mail-send-history.entity';

@CustomRepository(MailSendHistory)
export class MailSendHistoryRepository extends BaseRepository<MailSendHistory> {}
