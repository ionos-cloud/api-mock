import {JSONPath} from 'jsonpath-plus'

export class SymbolRegistry {
  protected data: {[key: string]: any} = {}

  public save(key: string, value: any): this {
    if (!key.includes('.')) {
      this.data[key] = value
      return this
    }
    let obj = this.data
    const parts = key.split('.')
    for (let i = 0; i < parts.length - 1; i++) {
      obj[parts[i]] = {}
      obj = obj[parts[i]]
    }
    obj[parts[parts.length - 1]] = value
    return this
  }

  public getAll(): {[key: string]: any} {
    return this.data
  }

  public get(key: string): any {
    if (key.includes('.')) {
      /* json path */
      const path = '$.' + key.substr(key.indexOf('.') + 1)
      const objName = key.substr(0, key.indexOf('.'))
      const obj = this.data[objName]
      if (!obj) return undefined
      // eslint-disable-next-line new-cap
      return JSONPath({path, json: obj, wrap: false})
    }

    return this.data[key]
  }

  public del(key: string): this {

    console.log('removing key: ' + key)
    if (!key.includes('.')) {
      delete this.data[key]
      return this
    }
    let obj = this.data
    const parts = key.split('.')
    for (let i = 0; i < parts.length - 1; i++) {
      if (obj[parts[i]] === undefined) {
        return this
      }
      obj = obj[parts[i]]
    }
    delete obj[parts[parts.length - 1]]
    console.log(this.data)
    return this

  }

  public clear(): this {
    this.data = {}
    return this
  }

  public dump(): string {
    return JSON.stringify(this.data)
  }
}

export default new SymbolRegistry()
