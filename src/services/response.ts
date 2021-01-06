import {IncomingMessage, ServerResponse} from 'http';

export class Response {
  body: any = {}
  headers: {[key: string]: any} = {}
  code = 200

  render(req: IncomingMessage, res: ServerResponse): void {
    this.prepare(req)
    res.writeHead(this.code, this.headers);
    if (this.body != null) {
      res.write(JSON.stringify(this.body));
    }
    res.end();
  }

  prepare(req: IncomingMessage): void {

  }

}
