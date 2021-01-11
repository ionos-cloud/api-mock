import {ApiMockFunction} from '../services/function.service'
import {v4 as uuid} from 'uuid'

export class UuidFunc implements ApiMockFunction {
  name = 'uuid'

  args = null

  /* we assume args were already validated by the FunctionService */
  public run(): string {
    return uuid()
  }
}
