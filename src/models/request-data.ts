import {IncomingHttpHeaders} from 'http'

export interface RequestData {
  method: string;
  body?: any;
  headers: IncomingHttpHeaders;
  url: string;
  pathVars: {[key: string]: any};
  queryParams: {[key: string]: any};
  localVars: {[key: string]: any};
}
