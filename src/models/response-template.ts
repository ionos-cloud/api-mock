import {SymbolRegistry} from '../services/symbol-registry'
import {Parser} from '../services/parser'
import registry from '../services/symbol-registry'
import cliService from '../services/cli.service'
import {Sandbox} from './sandbox'
import {ResponseData} from './response-data'
import {RequestData} from './request-data'
import {State} from './state'

export class ResponseTemplate {

  if?: string = undefined
  state?: {
    set?: {[key: string]: string};
    remove?: string[];
  } = undefined

  body: any = {}
  headers: {[key: string]: any} = {}
  code = 200

  beforeScript?: string = undefined
  afterScript?: string = undefined

  render(request: RequestData): ResponseData {

    if (this.beforeScript !== undefined) {
      this.runScript(this.beforeScript, request, {code: this.code, body: '', headers: {}})
    }

    const response: ResponseData = this.prepareResponse(request)

    this.updateState(request, response)
    if (this.afterScript !== undefined) {
      this.runScript(this.afterScript, request, response)
    }

    cliService.debug('STATE: ' + JSON.stringify(registry.getAll()))

    return response
  }

  runScript(script: string, request: RequestData, response: ResponseData) {
    try {
      const sandbox = new Sandbox({request, response})
      sandbox.run(script)
    } catch (error) {
      cliService.error(`script in ${this.code} response threw an error: ${error.message}`)
    }
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
        State.set(`${parser.parse(key)}`, parser.parseObj(this.state.set[key]))
      }
    }

    if (this.state.remove !== undefined) {
      if (typeof this.state.remove !== 'object' || !Array.isArray(this.state.remove)) {
        throw new TypeError(`expected state.remove node to be array, got ${typeof this.state.remove}`)
      }
      for (const key of this.state.remove) {
        State.del(`${parser.parse(key)}`)
      }
    }
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

  prepareResponse(request: RequestData): ResponseData {
    const resp: ResponseData = {
      code: 200,
      body: '',
      headers: {}
    }
    const reg = new SymbolRegistry()
    reg.save('request', request)

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

  matchRequest(request: RequestData): boolean {
    /* init localVars here */
    request.localVars = {}

    if (this.if === undefined || this.if === null || this.if === '') return true
    try {
      const sandbox = new Sandbox({request, response: {code: this.code, headers: {}, body: ''}})
      const ifMatched =  sandbox.run(`return ${this.if}`)
      if (ifMatched) {
        cliService.debug(`if condition matched: ${this.if}`)
      }
      return ifMatched
    } catch (error) {
      cliService.error(`'if' condition '${this.if}' for ${this.code} response threw an error: ${error.message}`)
    }

    return false
  }

}
