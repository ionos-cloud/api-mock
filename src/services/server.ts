import {IncomingMessage, ServerResponse} from 'http'
import {Spec} from './spec';
import * as http from 'http';

const DEFAULT_PORT = 8080
export class Server {

  spec: Spec = new Spec()
  port = DEFAULT_PORT
  constructor(spec: string, port = DEFAULT_PORT) {
    this.spec.parse(spec)
    this.port = port
  }

  run(): void {
    console.log(`listening on ${this.port}`);

    http.createServer((req: IncomingMessage, res: ServerResponse) => {

      try {
        console.log('new request received')
        this.spec.matchRequest(req).render(req, res)
      } catch (err) {
        res.writeHead(500);
        res.write(JSON.stringify({
          error: err.message,
          stack: err.stack,
        }));
        res.end();
      }

    }).listen(this.port);
  }
}
