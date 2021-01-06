export class ConfigService {

  private debug = false

  private verbose = false

  public setDebug(d: boolean): this {
    this.debug = d
    return this
  }

  public setVerbose(v: boolean): this {
    this.verbose = v
    return this
  }

  public isDebug(): boolean {
    return this.debug
  }

  public isVerbose(): boolean {
    return this.verbose
  }
}

export default new ConfigService()
