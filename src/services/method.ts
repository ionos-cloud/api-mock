import {Response} from './response'
import {RevivalSchema} from 'revivejs'

export class Method {
  response: Response = new Response()

  getResponse(): Response {
    return this.response
  }

  static getRevivalSchema(): RevivalSchema<Method> {
    return {
      type: Method,
      properties: {
        response: Response
      }
    }
  }
}
