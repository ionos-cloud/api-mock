import {RequestData} from './request-data'
import {Endpoint} from './endpoint'
import {revive} from 'revivejs'
import {ResponseTemplate} from './response-template'
const yaml = require('yaml')

import {MockError} from '../errors/mock.error'

export class Spec {
  endpoints: {[key: string]: Endpoint} = {}

  parse(spec: string): void {
    const obj = yaml.parse(spec)

    for (const path of Object.keys(obj)) {
      if (!isValidPath(path)) {
        throw new TypeError(`invalid path '${path}'`)
      }

      this.endpoints[path] = revive(obj[path], Endpoint, {failOnUnknownFields: true})
      this.endpoints[path].setPath(path)
    }
  }

  matchRequest(request: RequestData): ResponseTemplate {

    for (const route of Object.keys(this.endpoints)) {
      const responseTemplate = this.endpoints[route].matchRequest(request)
      if (responseTemplate !== undefined) {
        /* endpoint found */
        return responseTemplate
      }
    }

    throw new MockError(`path ${request.url} not found in spec`, 404)

  }

}

function isValidPath(path: string): boolean {
  return path.match('[/a-zA-Z0-9{}_-]+') !== null
}


