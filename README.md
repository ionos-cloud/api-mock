@ionos-cloud/api-mock
=====================

Ionos Cloud API Mock Engine

![CI](https://github.com/ionos-cloud/api-mock/workflows/CI/badge.svg)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @ionos-cloud/api-mock
$ csdk-api-mock COMMAND
running command...
$ csdk-api-mock (-v|--version|version)
@ionos-cloud/api-mock/1.0.0 darwin-x64 node-v14.15.0
$ csdk-api-mock --help [COMMAND]
USAGE
  $ csdk-api-mock COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`csdk-api-mock hello [FILE]`](#csdk-api-mock-hello-file)
* [`csdk-api-mock help [COMMAND]`](#csdk-api-mock-help-command)

## `csdk-api-mock hello [FILE]`

describe the command here

```
USAGE
  $ csdk-api-mock hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ csdk-api-mock hello
  hello world from ./src/run.ts!
```

_See code: [src/commands/run.ts](https://github.com/ionos-cloud/api-mock/blob/v1.0.0/src/commands/hello.ts)_

## `csdk-api-mock help [COMMAND]`

display help for csdk-api-mock

```
USAGE
  $ csdk-api-mock help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_
<!-- commandsstop -->
