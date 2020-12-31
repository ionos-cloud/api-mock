const http = require('http')
const path = require('path')

const usage = (msg) => {
  console.error(`error: ${msg}`)
  console.error(`usage: node ${path.basename(process.argv[1])} <map_file> [port]`)
  process.exit(1)
}

let map = process.argv[2]
if (map === undefined) {
  usage('response map not specified')
}

const portArg = process.argv[3]
let port = 8080
if (portArg !== undefined) {
  port = parseInt(portArg, 10)
  if (isNaN(port)) {
    usage(`invalid port: ${portArg}`)
  }
}

if (map[0] !== '/' && map.substr(0, 2) !== './') {
  map = `./${map}`
}

try {
  const responseMap = require(map)

  console.log(`listening on ${port}`)

  http.createServer((req, res) => {

    try {

      const [url] = req.url.split('?')

      const response = responseMap[url]
      if (response === undefined) {
        res.writeHead(404)
        res.write(JSON.stringify({"error": "path not found"}))
        res.end()
        return
      }

      const code = response.code || 200
      const headers = response.headers || {}
      const body = response.body

      if (isNaN(parseInt(code, 10))) {
        res.writeHead(500)
        res.write(JSON.stringify({
          error: `Invalid response code: ${code}`
        }))
        res.end()
        return
      }

      if (typeof (headers) !== 'object') {
        res.writeHead(500)
        res.write(JSON.stringify({
          error: `Invalid headers specified for endpoint: ${url}. Expected an object, got ${typeof headers} instead.`
        }))
        return
      }

      res.writeHead(code, headers)
      if (body != null) {
        res.write(JSON.stringify(body))
      }
      res.end()

    } catch (err) {
      res.writeHead(500)
      res.write(JSON.stringify({
        error: err.message,
        stack: err.stack
      }))
      res.end()
    }

  }).listen(port)

} catch (e) {
  console.error(e.message)
  process.exit(1)
}
