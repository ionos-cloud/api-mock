import {Response} from './response';
import {RevivalSchema} from 'revivejs';
import {IncomingMessage} from 'http';
import {Method} from './method';

export class Endpoint {
  get?: Method = undefined

  post?: Method = undefined

  put?: Method = undefined

  patch?: Method = undefined

  static getRevivalSchema(): RevivalSchema<Endpoint> {
    return {
      type: Endpoint,
      properties: {
        get: {
          type: Method,
          properties: {
            response: Response
          }
        },
        post: Method,
        put: Method,
        patch: Method
      }
    }
  }

  matchRequest(req: IncomingMessage): Response {

    if (req.method === undefined) throw new Error('undefined HTTP method')

    switch (req.method.toLowerCase()) {
      case 'get':
        if (this.get !== undefined) return this.get.getResponse()
        break
      case 'post':
        if (this.post !== undefined) return this.post.getResponse()
        break
      case 'patch':
        if (this.patch !== undefined) return this.patch.getResponse()
        break
      case 'put':
        if (this.put !== undefined) return this.put.getResponse()
        break
    }

    throw new Error(`method ${req.method} not defined in endpoint spec`)
  }
}
