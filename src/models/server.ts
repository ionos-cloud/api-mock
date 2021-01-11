import {IncomingMessage, ServerResponse} from 'http'
import {Spec} from './spec'
import cliService from '../services/cli.service'
import {RequestData} from './request-data'

import * as http from 'http'
import {ResponseData} from './response-data'

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

  getRequestData(req: IncomingMessage): RequestData {
    cliService.debug('request headers:')
    cliService.debug(JSON.stringify(req.headers))
    return {
      /* the body is filled in later from the stream */

      headers: req.headers,
      url: req.url,
      method: req.method
    }
  }

  run(): void {
    cliService.info(`listening on ${this.port}`)
    http.createServer((req: IncomingMessage, res: ServerResponse) => {

      try {
        cliService.h1(`${req.method} ${req.url}`)
        if (req.method === undefined) return

        const requestData = this.getRequestData(req)

        if (['PUT', 'PATCH', 'POST'].includes(req.method)) {
          /* we have a body */
          const buffer: Uint8Array[] = []
          req
            .on('data', chunk => {
              buffer.push(chunk)
            })
            .on('end', () => {
              requestData.body = Buffer.concat(buffer).toString()
              cliService.debug('request body:')
              cliService.debug(requestData.body)
              try {
                this.sendResponse(res, this.spec.matchRequest(requestData).render(requestData))
              } catch (error) {
                this.sendError(res, error)
              }
            }).on('error', error => {
              this.sendError(res, error)
            })
        } else {
          this.sendResponse(res, this.spec.matchRequest(req).render(requestData))
        }
      } catch (error) {
        this.sendError(res, error)
      }

    }).listen(this.port);
  }

  sendResponse(res: ServerResponse, data: ResponseData): void {
    res.writeHead(data.code, data.headers);
    if (data.body !== null) {
      res.write(JSON.stringify(data.body));
    }
    res.end();
    cliService.success('request served')
  }
}
