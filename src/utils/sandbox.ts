import registry from '../services/symbol-registry'

export function sandboxRun(src: string, data: {[key: string]: any} = {}) {
  const scopedSrc = 'with (sandbox) { ' + src + '}'

  // eslint-disable-next-line no-new-func
  const code = new Function('sandbox', scopedSrc)

  const sandbox = {...registry.getAll(), ...data}
  const proxy = new Proxy(sandbox, {has, get})
  return code(proxy)
}

/* first we mask out the global and lexical scope, nothing gets out of the with scope */
function has(): boolean {
  return true
}

/* second we make sure we don't run into unscopables */
function get(target: any, p: string | number | symbol): any {
  if (p === Symbol.unscopables) {
    return undefined
  }

  return target[p]
}
