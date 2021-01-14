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
@ionos-cloud/api-mock/1.0.1 darwin-x64 node-v14.15.0
$ csdk-api-mock --help [COMMAND]
USAGE
  $ csdk-api-mock COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`csdk-api-mock help [COMMAND]`](#csdk-api-mock-help-command)
* [`csdk-api-mock run [FILE]`](#csdk-api-mock-run-file)

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

## `csdk-api-mock run [FILE]`

run a mock server using an endpoint map

```
USAGE
  $ csdk-api-mock run [FILE]

OPTIONS
  -d, --debug
  -h, --help       show CLI help
  -p, --port=port  [default: 8080]

EXAMPLE
  $ csdk-api-mock run map.json
```

_See code: [src/commands/run.ts](https://github.com/ionos-cloud/api-mock/blob/v1.0.1/src/commands/run.ts)_
<!-- commandsstop -->
