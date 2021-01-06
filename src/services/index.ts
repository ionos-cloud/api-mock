import path = require('path')
import {Server} from './server'
import {readFileSync} from 'fs'

const usage = (msg: string) => {
  console.error(`error: ${msg}`)
  console.error(`usage: node ${path.basename(process.argv[1])} <map_file> [port]`)
  process.exit(1)
};

const map = process.argv[2]
if (map === undefined) {
  usage('response map not specified')
}

const portArg = process.argv[3];
let port = undefined
if (portArg !== undefined) {
  port = parseInt(portArg, 10);
  if (isNaN(port)) {
    usage(`invalid port: ${portArg}`);
  }
}

try {
  new Server(readFileSync(map).toString()).run()
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
