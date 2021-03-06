import registry from '../services/symbol-registry'
import cliService from '../services/cli.service'
import {State} from './state'
import {v4 as uuid} from 'uuid'

export class Sandbox {
  sandbox: {[key: string]: any} = {}
  sandboxProxy: any
  constructor(data: { [key: string]: any } = {}) {
    this.setData(data)
    this.sandboxProxy = new Proxy(this.sandbox, {has, get})
  }

  public setData(data: { [key: string]: any }) {
    this.sandbox = {

      /* useful data */
      ...registry.getAll(),

      /* let them serialize objects */
      JSON,

      /* output support */
      cliService,
      console,

      /* Object for Object.keys */
      Object,

      /* useful methods */
      State,

      /* uuid */
      uuid,

      /* custom user data */
      ...data
    }
  }

  public run(src: string): any {
    const scopedSrc = 'with (sandbox) { ' + src + '}'

    // eslint-disable-next-line no-new-func
    const code = new Function('sandbox', scopedSrc)

    cliService.debug('running script ...')
    cliService.debug(src)

    return code(this.sandboxProxy)
  }
}

/* first we mask out the global and lexical scope, nothing gets out of the with scope */
function has(): boolean {
  return true
}

/* second we make sure we don't run into unscopables that would evade the 'with' scope */
function get(target: any, p: string | number | symbol): any {
  if (p === Symbol.unscopables) {
    return undefined
  }

  return target[p]
}
