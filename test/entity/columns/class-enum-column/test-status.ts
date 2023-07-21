import { CodeName } from 'src/entity/code-name';
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class TestStatus extends EnumType<TestStatus>() implements CodeName {
  static readonly READY = new TestStatus('READY', '준비');
  static readonly PROGRESS = new TestStatus('PROGRESS', '진행중');
  static readonly DONE = new TestStatus('DONE', '완료');

  private constructor(readonly code: string, readonly name: string) {
    super();
  }
}
