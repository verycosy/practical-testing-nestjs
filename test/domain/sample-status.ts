import { CodeName } from 'src/domain/code-name';
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class SampleStatus extends EnumType<SampleStatus>() implements CodeName {
  static readonly READY = new SampleStatus('READY', '준비');
  static readonly PROGRESS = new SampleStatus('PROGRESS', '진행중');
  static readonly DONE = new SampleStatus('DONE', '완료');

  private constructor(readonly code: string, readonly name: string) {
    super();
  }
}
