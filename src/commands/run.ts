import {Command, flags} from '@oclif/command'
import {Server} from '../models/server';
import {readFileSync} from 'fs';
import configService from '../services/config.service'

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
    }),
    debug: flags.boolean({
      char: 'd',
      default: false
    })
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Run)
    if (args.file === undefined) {
      throw new Error('No endpoint map specified')
    }

    let port: number | undefined
    if (flags.port !== undefined) {
      port = Number(flags.port)
      if (isNaN(port)) {
        throw new TypeError(`invalid port: ${flags.port}`)
      }
    }

    configService.setDebug(flags.debug)

    const server = new Server(readFileSync(args.file).toString(), port)
    server.run()
  }
}
