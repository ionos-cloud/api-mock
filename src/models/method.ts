import {ResponseTemplate} from './response-template'
import {RevivalSchema} from 'revivejs'

export class Method {
  responses: ResponseTemplate[] = []

  getResponses(): ResponseTemplate[] {
    return this.responses
  }

  static getRevivalSchema(): RevivalSchema<Method> {
    return {
      type: Method,
      properties: {
        responses: {
          items: ResponseTemplate
        }
      }
    }
  }
}
