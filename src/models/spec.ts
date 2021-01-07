import {IncomingMessage} from 'http'
import {Endpoint} from './endpoint'
import {revive} from 'revivejs'
import {Response} from './response'
import cliService from '../services/cli.service'

import util = require('util')

export class Spec {
  data: {[key: string]: Endpoint} = {}

  parse(spec: string): void {
    const obj = JSON.parse(spec)

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

    if (this.data[url] === undefined) throw new TypeError(`path ${url} not found in spec`)

    const responses = this.data[url].matchRequest(req)
    for (const response of responses) {
      if (response.checkIf(req, reqBody)) {
        cliService.info(`response with code ${response.code} matched`)
        if (response.if !== undefined) {
          cliService.info(`if condition was: ${response.if}`)
        }
        return response
      }
    }

    throw new TypeError(`no matching response found for ${req.method} ${url}`)
  }
}

function isValidPath(path: string): boolean {
  return path.match('[/a-zA-Z0-9{}_-]+') !== null
}
