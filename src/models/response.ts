import {IncomingMessage, OutgoingHttpHeaders, ServerResponse} from 'http'
import {SymbolRegistry} from '../services/symbol-registry'
import {Parser} from '../services/parser'
import registry from '../services/symbol-registry'
import cliService from '../services/cli.service'
import {sandboxRun} from '../utils/sandbox'

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
        throw new TypeError('expected state.set node to be object, got array')
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

    cliService.debug('STATE: ' + JSON.stringify(registry.getAll()))
  }

  debugResponse(response: Resp): void {
    cliService.debug('sending response')
    cliService.indent()
    cliService.debug(`code: ${response.code}`)
    cliService.debug('headers:')
    cliService.indent()
    cliService.debug(JSON.stringify(response.headers))
    cliService.outdent()
    cliService.debug('body:')
    cliService.indent()
    cliService.debug(JSON.stringify(response.body))
    cliService.outdent()
    cliService.outdent()
  }

  doRender(res: ServerResponse, response: Resp): void {
    this.debugResponse(response)
    res.writeHead(response.code, response.headers);
    if (response.body !== null) {
      res.write(JSON.stringify(response.body));
    }
    res.end();
    cliService.success('request served')
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
    /* fix missing content-type header */
    if (resp.headers['Content-Type'] === undefined) {
      resp.headers['Content-Type'] = 'application/json'
    }
    resp.code = this.code
    return resp
  }

  checkIf(req: IncomingMessage, reqBody?: any): boolean {
    if (this.if === undefined || this.if === null || this.if === '') return true

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const state = registry.get(Response.STATE_KEY) || {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = {
      body: reqBody,
      headers: req.headers
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stateGet = (path: string): any =>  {
      if (!path.includes('.')) {
        return state[path]
      }

      let obj = state
      for (const part of path.split('.')) {
        if (obj[part] === undefined) {
          return undefined
        }
        obj = obj[part]
      }

      return obj
    }

    try {
      return sandboxRun(`return ${this.if}`, {request, stateGet})
    } catch (error) {
      cliService.error(`error in 'if' condition for ${this.code} response: ${error.message}`)
    }

    return false
  }

}
