import {Command, flags} from '@oclif/command'

export default class Run extends Command {
  static description = 'run a mock server using an endpoint map'

  static examples = [
    '$ csdk-api-mock run map.json',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    port: flags.string({
      char: 'p',
      default: '8080'
    })
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Run)
    if (args.file === undefined) {
      throw new Error('No endpoint map specified')
    }
    

  }
}
