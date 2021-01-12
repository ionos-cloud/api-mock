/**
 * State manipulation utilities
 */

import registry from '../services/symbol-registry'

export class State {
  public static KEY = 'state'

  public static init(): void {
    registry.save(State.KEY, {})
  }

  public static set(path: string, val: any): any {
    registry.save(`${State.KEY}.${path}`, val)
    return val
  }

  public static get(path: string): any {
    const state = registry.get(State.KEY) || {}
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

  public static getOrSetObj(path: string, defaultValue: any = {}): any {
    const val = State.get(path)
    if (val === undefined) {
      State.set(path, defaultValue)
      return defaultValue
    }
    return val
  }

  public static del(path: string): void {
    registry.del(`${State.KEY}.${path}`)
  }

  public static inc(counter: string, step = 1): any {
    if (step < 0) {
      throw new TypeError('negative inc step')
    }
    const currentValue = State.getOrSetObj(counter, 0)
    State.set(counter, currentValue + step)
    return currentValue + step
  }

  public static dec(counter: string, step = 1): any {
    if (step < 0) {
      throw new TypeError('negative dec step')
    }
    const currentValue = State.getOrSetObj(counter, 0)
    if (currentValue >= step) {
      State.set(counter, currentValue - step)
      return currentValue - step
    }
    State.set(counter, 0)
    return 0

  }
}
