import {SymbolRegistry} from '../services/symbol-registry'
import {Parser} from '../services/parser'
import registry from '../services/symbol-registry'
import cliService from '../services/cli.service'
import {Sandbox} from '../utils/sandbox'
import {ResponseData} from './response-data'
import {RequestData} from './request-data'

export class ResponseTemplate {

  public static STATE_KEY = 'state'
  if?: string = undefined
  state?: {
    set?: {[key: string]: string};
    remove?: string[];
  } = undefined

  body: any = {}
  headers: {[key: string]: any} = {}
  code = 200

  script?: string = undefined

  render(request: RequestData): ResponseData {
    const response: ResponseData = this.prepareResponse(request)

    const sandbox = new Sandbox(this.buildSandbox(request, response))
    if (this.script !== undefined) {
      sandbox.run(this.script)
    }
    this.updateState(request, response)
    return response
  }

  updateState(request: RequestData, response: ResponseData): void {

    if (this.state === undefined) return

    const reqReg = new SymbolRegistry()
    reqReg.save('request', request).save('response', response)
    const parser = new Parser(reqReg)

    if (this.state.set !== undefined) {
      if (typeof this.state.set !== 'object') {
        throw new TypeError(`expected state.set node to be object, got ${typeof this.state.remove}`)
      }
      if (Array.isArray(this.state.set)) {
        throw new TypeError('expected state.set node to be object, got array')
      }
      for (const key of Object.keys(this.state.set)) {
        registry.save(`${ResponseTemplate.STATE_KEY}.${key}`, parser.parseObj(this.state.set[key]))
      }
    }

    if (this.state.remove !== undefined) {
      if (typeof this.state.remove !== 'object' || !Array.isArray(this.state.remove)) {
        throw new TypeError(`expected state.remove node to be array, got ${typeof this.state.remove}`)
      }
      for (const key of this.state.remove) {
        registry.del(`${ResponseTemplate.STATE_KEY}.${key}`)
      }
    }

    cliService.debug('STATE: ' + JSON.stringify(registry.getAll()))
  }

  debugResponse(response: ResponseData): void {
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

  prepareResponse(req: RequestData): ResponseData {
    const resp: ResponseData = {
      code: 200,
      body: '',
      headers: {}
    }
    const reg = new SymbolRegistry()
    reg.save('request', {
      body: req.body,
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

    this.debugResponse(resp)
    return resp
  }

  buildSandbox(request: RequestData, response: ResponseData) {
    return {
      request,
      response,
      cliService,
      JSON,
      stateGet: (path: string): any =>  {
        const state = registry.get(ResponseTemplate.STATE_KEY) || {}
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
    }
  }

  matchRequest(request: RequestData): boolean {
    if (this.if === undefined || this.if === null || this.if === '') return true
    try {
      const sandbox = new Sandbox(this.buildSandbox(request, {code: this.code, headers: {}, body: ''}))
      const ifMatched =  sandbox.run(`return ${this.if}`)
      if (ifMatched) {
        cliService.debug(`if condition matched: ${this.if}`)
      }
      return ifMatched
    } catch (error) {
      cliService.error(`error in 'if' condition for ${this.code} response: ${error.message}`)
    }

    return false
  }

}
