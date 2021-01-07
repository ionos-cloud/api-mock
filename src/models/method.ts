import {Response} from './response'
import {RevivalSchema} from 'revivejs'

export class Method {
  responses: Response[] = []

  getResponses(): Response[] {
    return this.responses
  }

  static getRevivalSchema(): RevivalSchema<Method> {
    return {
      type: Method,
      properties: {
        responses: {
          items: Response
        }
      }
    }
  }
}
