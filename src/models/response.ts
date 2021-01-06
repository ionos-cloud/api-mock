import {IncomingMessage, OutgoingHttpHeaders, ServerResponse} from 'http';
import {SymbolRegistry} from '../services/symbol-registry';
import {Parser} from '../services/parser';

interface Resp {
  code: number;
  headers: OutgoingHttpHeaders;
  body: any;
}

export class Response {
  body: any = {}

  headers: {[key: string]: any} = {}

  code = 200

  render(req: IncomingMessage, res: ServerResponse): void {
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
          body = Buffer.concat(buffer).toString()
          this.doRender(res, this.prepare(req, body))
        })
    } else {
      this.doRender(res, {code: this.code, headers: this.headers, body: this.body})
    }

  }

  doRender(res: ServerResponse, response: Resp): void {
    res.writeHead(response.code, response.headers);
    if (response.body !== null) {
      res.write(JSON.stringify(response.body));
    }
    res.end();
  }

  prepare(req: IncomingMessage, body: string): Resp {
    const resp: Resp = {
      code: 200,
      body: '',
      headers: {}
    }
    const reg = new SymbolRegistry()
    reg.save('input', {
      body: JSON.parse(body),
      headers: req.headers
    })

    const parser = new Parser(reg)
    resp.body = parser.parseObj(this.body)
    resp.headers = parser.parseObj(this.headers)
    resp.code = this.code
    return resp
  }

}
