import {IncomingMessage} from 'http'
import {Endpoint} from './endpoint'
import {revive} from 'revivejs'
import {Response} from './response'

export class Spec {
  data: {[key: string]: Endpoint} = {}

  parse(spec: string): void {
    const obj = JSON.parse(spec)

    for (const path of Object.keys(obj)) {
      if (!isValidPath(path)) {
        throw new TypeError(`invalid path '${path}'`)
      }

      this.data[path] = revive(obj[path], Endpoint)

    }

    console.log(this.data)
  }

  matchRequest(req: IncomingMessage): Response {

    if (req.url === undefined) throw new TypeError('undefined url')
    if (req.method === undefined) throw new TypeError('undefined HTTP method')

    const [url] = req.url.split('?')

    if (this.data[url] === undefined) throw new TypeError(`path ${url} not found in spec`)

    return this.data[url].matchRequest(req)

  }
}


function isValidPath(path: string): boolean {
  return path.match('[/a-zA-Z0-9{}_-]+') !== null
}
