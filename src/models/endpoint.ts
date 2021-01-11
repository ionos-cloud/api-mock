import {ResponseTemplate} from './response-template';
import {RevivalSchema} from 'revivejs';
import {IncomingMessage} from 'http';
import {Method} from './method';
import {MockError} from '../errors/mock.error'
import {RequestData} from './request-data'
import cliService from '../services/cli.service'

export class Endpoint {

  route = ''

  get?: Method = undefined

  post?: Method = undefined

  put?: Method = undefined

  patch?: Method = undefined

  delete?: Method = undefined

  static getRevivalSchema(): RevivalSchema<Endpoint> {
    return {
      type: Endpoint,
      properties: {
        get: Method,
        post: Method,
        put: Method,
        patch: Method,
        delete: Method
      }
    }
  }

  setPath(r: string) {
    this.route = r
    return this
  }

  matchRequest(request: RequestData): ResponseTemplate | undefined {

    const pathVars = matchUrlToRoute(request.url, this.route)
    if (pathVars === undefined) {
      /* the request URL doesn't match our route */
      return undefined
    }

    /* route matched */
    request.pathVars = pathVars

    let responseTemplates: ResponseTemplate[] | undefined
    switch (request.method.toLowerCase()) {
      case 'get':
        if (this.get !== undefined) responseTemplates = this.get.getResponses()
        break
      case 'post':
        if (this.post !== undefined) responseTemplates = this.post.getResponses()
        break
      case 'patch':
        if (this.patch !== undefined) responseTemplates = this.patch.getResponses()
        break
      case 'put':
        if (this.put !== undefined) responseTemplates = this.put.getResponses()
        break
      case 'delete':
        if (this.delete !== undefined) responseTemplates = this.delete.getResponses()
        break
    }

    if (responseTemplates === undefined) {
      throw new MockError(`method ${request.method} not defined in endpoint spec`, 404)
    }

    for (const responseTpl of responseTemplates) {
      if (responseTpl.matchRequest(request)) {
        cliService.info(`${responseTpl.code} response matched`)
        return responseTpl
      }
    }

    throw new MockError(`no matching response found for ${request.method} ${request.url}`, 404)

  }
}

function matchUrlToRoute(u: string, p: string): {[key: string]: string} | undefined {

  const url = trimChar(u)
  const pattern = trimChar(p)

  const urlParts = url.split('/')
  const patternParts = pattern.split('/')

  if (urlParts.length !== patternParts.length) {
    return undefined
  }

  const ret: {[key: string]: string} = {}
  for (let i = 0; i < urlParts.length; i++) {
    const pathVar = extractPathVar(patternParts[i])
    if (pathVar !== undefined) {
      ret[pathVar] = urlParts[i]
      continue
    }
    if (urlParts[i] !== patternParts[i]) {
      return undefined
    }
  }
  return ret
}

function trimChar(path: string, c = '/'): string {
  let s = path
  while (s[0] === c) {
    s = s.substring(1)
  }

  while (s[s.length - 1] === c) {
    s = s.substring(0, s.length - 1)
  }

  return s
}

function extractPathVar(str: string): string | undefined {
  if (str[0] === '{' && str[str.length - 1] === '}') {
    return str.substring(1, str.length - 1)
  }

  return undefined
}
