import {IncomingMessage, ServerResponse} from 'http'
import {Spec} from './spec'
import cliService from '../services/cli.service'
import registry from '../services/symbol-registry'

import * as http from 'http'
import chalk from 'chalk'

const DEFAULT_PORT = 8080
export class Server {

  spec: Spec = new Spec()

  port = DEFAULT_PORT

  constructor(spec: string, port = DEFAULT_PORT) {
    this.spec.parse(spec)
    this.port = port
  }

  sendError(res: ServerResponse, error: any): void {
    cliService.error(error.message)
    if (error.code === undefined) {
      res.writeHead(500);
    } else {
      res.writeHead(error.code)
    }
    res.write(JSON.stringify({
      error: error.message,
      stack: error.stack,
    }));
    res.end();
  }

  run(): void {
    cliService.info(`listening on ${this.port}`)

    http.createServer((req: IncomingMessage, res: ServerResponse) => {

      try {
        cliService.h1(`${req.method} ${req.url}`)
        if (req.method === undefined) return

        if (['PUT', 'PATCH', 'POST'].includes(req.method)) {
          /* we have a body */
          const buffer: Uint8Array[] = []
          let body = ''
          req
            .on('data', chunk => {
              buffer.push(chunk)
            })
            .on('end', () => {
              const bodyStr = Buffer.concat(buffer).toString()
              body = JSON.parse(bodyStr)
              cliService.debug('request body:')
              cliService.debug(bodyStr)
              cliService.debug('request headers:')
              cliService.debug(JSON.stringify(req.headers))
              try {
                this.spec.matchRequest(req, body).render(req, res, body)
              } catch (error) {
                this.sendError(res, error)
              }
            }).on('error', (error) => {
              this.sendError(res, error)
            })
        } else {
          cliService.debug('request headers:')
          cliService.debug(JSON.stringify(req.headers))
          this.spec.matchRequest(req).render(req, res)
        }
      } catch (error) {
        this.sendError(res, error)
      }

    }).listen(this.port);
  }
}
