import {
  Injectable
} from '@nestjs/common'
import {
  Time,
  Data,
  Query
} from './util'
import {
  Util,
  UtilInstance
} from './helper.type'

@Injectable()
export class HelperService {
  public select<T extends Util>(utilType: T): UtilInstance<T> {
    switch (utilType) {
      case 'time':
        return Time.getInstance() as unknown as UtilInstance<T>

      case 'data':
        return Data.getInstance() as unknown as UtilInstance<T>

      case 'query':
        return Query.getInstance() as unknown as UtilInstance<T>

      default:
        return undefined as unknown as UtilInstance<T>
    }
  }
}
