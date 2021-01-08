import {cli} from 'cli-ux'
import chalk from 'chalk'
import configService from './config.service'

export class CliService {
  protected indentLevel = 1

  protected indentString = '  '

  protected buildIndent() {
    let indent = ''
    for (let i = 0; i < this.indentLevel; i++) {
      indent += this.indentString
    }
    return indent
  }

  public h1(msg: string) {
    cli.info('')
    let bar = ''
    for (let i = 0; i < msg.length + 2; i++) {
      bar += '─'
    }
    cli.info(`╭${bar}╮`)
    cli.info(`│ ${msg} │`)
    cli.info(`╰${bar}╯`)
  }

  public indent(amount = 1) {
    this.indentLevel += amount
  }

  public outdent(amount = 1) {
    this.indentLevel -= amount
  }

  public info(msg: any) {
    cli.info(this.buildIndent(), '  ❯ ', msg)
  }

  public warn(msg: any) {
    cli.warn(msg)
  }

  public error(msg: string) {
    cli.info(chalk.red('  ! ERROR: ') + chalk.redBright(msg))
  }

  public success(msg: any) {
    cli.info(chalk.greenBright('  ✔ '), msg)
  }

  public debug(msg: any) {
    if (configService.isDebug()) {
      // eslint-disable-next-line no-console
      console.debug(this.buildIndent(), chalk.gray('  ⇢ '), chalk.gray(msg))
    }
  }

  public print(msg: any) {
    // eslint-disable-next-line no-console
    console.log(this.buildIndent(), msg)
  }
}

export default new CliService()
