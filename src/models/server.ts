import {IncomingMessage, ServerResponse} from 'http'
import {Spec} from './spec'
import cliService from '../services/cli.service'

import * as http from 'http'

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
        this.spec.matchRequest(req).render(req, res)
      } catch (error) {
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
