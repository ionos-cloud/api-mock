import {Response} from './response';
import {RevivalSchema} from 'revivejs';
import {IncomingMessage} from 'http';
import {Method} from './method';
import {MockError} from '../errors/mock.error'

export class Endpoint {
  get?: Method = undefined

  post?: Method = undefined

  put?: Method = undefined

  patch?: Method = undefined

  delete?: Method = undefined

  static getRevivalSchema(): RevivalSchema<Endpoint> {
    return {
      type: Endpoint,
      properties: {
        get: Method,
        post: Method,
        put: Method,
        patch: Method,
        delete: Method
      }
    }
  }

  matchRequest(req: IncomingMessage): Response[] {

    if (req.method === undefined) throw new Error('undefined HTTP method')

    switch (req.method.toLowerCase()) {
      case 'get':
        if (this.get !== undefined) return this.get.getResponses()
        break
      case 'post':
        if (this.post !== undefined) return this.post.getResponses()
        break
      case 'patch':
        if (this.patch !== undefined) return this.patch.getResponses()
        break
      case 'put':
        if (this.put !== undefined) return this.put.getResponses()
        break
      case 'delete':
        if (this.delete !== undefined) return this.delete.getResponses()
        break
    }

    throw new MockError(`method ${req.method} not defined in endpoint spec`, 404)
  }
}
