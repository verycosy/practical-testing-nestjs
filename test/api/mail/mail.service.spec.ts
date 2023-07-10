import {
  anyOfClass,
  anyString,
  instance,
  mock,
  verify,
  when as given,
} from '@typestrong/ts-mockito';
import { MailService } from 'src/api/mail/mail.service';
import { MailSendClient } from 'src/client/mail/mail-send-client';
import { MailSendHistory } from 'src/entity/domain/history/mail/mail-send-history.entity';
import { MailSendHistoryRepository } from 'src/entity/domain/history/mail/mail-send-history.repository';

describe('MailService', () => {
  it('메일 전송 테스트', async () => {
    // given
    const mailSendClient = mock(MailSendClient);
    const mailSendHistoryRepository = mock(MailSendHistoryRepository);

    const mailService = new MailService(
      instance(mailSendClient),
      instance(mailSendHistoryRepository),
    );

    // NOTE: BDDMockito처럼 사용해보기
    given(
      mailSendClient.sendEmail(
        anyString(),
        anyString(),
        anyString(),
        anyString(),
      ),
    ).thenResolve(true);

    // when
    const result = await mailService.sendMail('', '', '', '');

    // then
    expect(result).toBe(true);
    verify(mailSendHistoryRepository.save(anyOfClass(MailSendHistory))).once();
  });
});
