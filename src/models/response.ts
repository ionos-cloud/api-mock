import {IncomingMessage, OutgoingHttpHeaders, ServerResponse} from 'http'
import {SymbolRegistry} from '../services/symbol-registry'
import {Parser} from '../services/parser'
import registry from '../services/symbol-registry'

interface Resp {
  code: number;
  headers: OutgoingHttpHeaders;
  body: any;
}

export class Response {

  static STATE_KEY = 'state'
  if?: string = undefined
  state?: {
    set?: {[key: string]: string};
    remove?: string[];
  } = undefined

  body: any = {}
  headers: {[key: string]: any} = {}
  code = 200

  render(req: IncomingMessage, res: ServerResponse, reqBody?: any): void {
    let resp = {code: this.code, headers: this.headers, body: this.body}
    if (reqBody !== undefined) {
      resp = this.prepare(req, reqBody)
    }
    this.updateState(req, resp, reqBody)
    this.doRender(res, resp)

  }

  updateState(req: IncomingMessage, response: Resp, reqBody?: any): void {

    if (this.state === undefined) return

    const reqReg = new SymbolRegistry()
    reqReg.save('request', {
      body: reqBody,
      headers: req.headers
    }).save('response', response)
    const parser = new Parser(reqReg)

    if (this.state.set !== undefined) {
      if (typeof this.state.set !== 'object') {
        throw new TypeError(`expected state.set node to be object, got ${typeof this.state.remove}`)
      }
      if (Array.isArray(this.state.set)) {
        throw new TypeError(`expected state.set node to be object, got array`)
      }
      for (const key of Object.keys(this.state.set)) {
        registry.save(`${Response.STATE_KEY}.${key}`, parser.parseObj(this.state.set[key]))
      }
    }

    if (this.state.remove !== undefined) {
      if (typeof this.state.remove !== 'object' || !Array.isArray(this.state.remove)) {
        throw new TypeError(`expected state.remove node to be array, got ${typeof this.state.remove}`)
      }
      for (const key of this.state.remove) {
        registry.del(`${Response.STATE_KEY}.${key}`)
      }
    }

  }

  doRender(res: ServerResponse, response: Resp): void {
    res.writeHead(response.code, response.headers);
    if (response.body !== null) {
      res.write(JSON.stringify(response.body));
    }
    res.end();
  }

  prepare(req: IncomingMessage, body: any): Resp {
    const resp: Resp = {
      code: 200,
      body: '',
      headers: {}
    }
    const reg = new SymbolRegistry()
    reg.save('request', {
      body,
      headers: req.headers
    })

    const parser = new Parser(reg)
    resp.body = parser.parseObj(this.body)
    resp.headers = parser.parseObj(this.headers)
    resp.code = this.code
    return resp
  }

  checkIf(req: IncomingMessage, reqBody?: any): boolean {
    if (this.if === undefined || this.if === null || this.if === '') return true

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const state = registry.get(Response.STATE_KEY)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = {
      body: reqBody,
      headers: req.headers
    }

    /* eval the if clause */
    // eslint-disable-next-line prefer-const
    let ifResult = true
    // eslint-disable-next-line no-eval
    eval(`ifResult = (${this.if})`)

    return ifResult
  }

}
