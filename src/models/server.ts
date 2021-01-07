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
              body = JSON.parse(Buffer.concat(buffer).toString())
              this.spec.matchRequest(req, body).render(req, res, body)
            })
        } else {
          this.spec.matchRequest(req).render(req, res)
        }

      } catch (error) {
        cliService.info(chalk.redBright('ERROR:') + ' ' + chalk.red(error.message))
        res.writeHead(500);
        res.write(JSON.stringify({
          error: error.message,
          stack: error.stack,
        }));
        res.end();
      }

    }).listen(this.port);
  }
}
