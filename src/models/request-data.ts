import {IncomingHttpHeaders} from 'http'

export interface RequestData {
  method: string;
  body?: string;
  headers: IncomingHttpHeaders;
  url: string;
  pathVars: {[key: string]: any};
  queryParams: {[key: string]: any};
}
