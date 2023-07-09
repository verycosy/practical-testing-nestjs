import { CodeName } from 'src/entity/code-name';
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class ClassEnumStatus
  extends EnumType<ClassEnumStatus>()
  implements CodeName
{
  static readonly TODO = new ClassEnumStatus('TODO', '할일');
  static readonly PROGRESS = new ClassEnumStatus('PROGRESS', '진행중');

  private constructor(readonly code: string, readonly name: string) {
    super();
  }
}
