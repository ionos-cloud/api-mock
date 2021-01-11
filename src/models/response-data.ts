import {OutgoingHttpHeaders} from 'http'

export interface ResponseData {
  body: string;
  headers: OutgoingHttpHeaders;
  code: number;
}
