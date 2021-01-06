import {Command, flags} from '@oclif/command'

export default class Hello extends Command {
  static description = 'run a mock server using an endpoint map'

  static examples = [
    '$ csdk-api-mock run map.json',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    port: flags.string({
      char: 'p'
    })
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Hello)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from ./src/commands/hello.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
