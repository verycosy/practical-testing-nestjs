import { CodeName } from 'src/entity/code-name';
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class ClassEnumTestStatus
  extends EnumType<ClassEnumTestStatus>()
  implements CodeName
{
  static readonly TODO = new ClassEnumTestStatus('TODO', '할일');
  static readonly PROGRESS = new ClassEnumTestStatus('PROGRESS', '진행중');

  private constructor(readonly code: string, readonly name: string) {
    super();
  }
}
