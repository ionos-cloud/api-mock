import {IncomingMessage} from 'http'
import {Endpoint} from './endpoint'
import {revive} from 'revivejs'
import {Response} from './response'
import cliService from '../services/cli.service'
const yaml = require('yaml')

import {MockError} from '../errors/mock.error'

export class Spec {
  data: {[key: string]: Endpoint} = {}

  parse(spec: string): void {
    const obj = yaml.parse(spec)

    for (const path of Object.keys(obj)) {
      if (!isValidPath(path)) {
        throw new TypeError(`invalid path '${path}'`)
      }

      this.data[path] = revive(obj[path], Endpoint, {failOnUnknownFields: true})

    }
  }

  matchRequest(req: IncomingMessage, reqBody?: any): Response {

    if (req.url === undefined) throw new TypeError('undefined url')
    if (req.method === undefined) throw new TypeError('undefined HTTP method')

    const [url] = req.url.split('?')

    if (this.data[url] === undefined) throw new MockError(`path ${url} not found in spec`, 404)

    const responses = this.data[url].matchRequest(req)
    for (const response of responses) {
      if (response.checkIf(req, reqBody)) {
        cliService.info(`${response.code} response matched`)
        if (response.if !== undefined) {
          cliService.debug(`if condition was: ${response.if}`)
        }
        return response
      }
    }

    throw new MockError(`no matching response found for ${req.method} ${url}`, 404)
  }
}

function isValidPath(path: string): boolean {
  return path.match('[/a-zA-Z0-9{}_-]+') !== null
}
