import { IncomingMessage, ServerResponse } from "http";

export default class Context {
  headers: any;

  method?: string;

  statusCode?: number;

  url?: string;

  pathname?: string;

  body: any = {};

  constructor(public req: IncomingMessage, public res: ServerResponse) {
    this.method = req.method;
    this.headers = req.headers;
    this.statusCode = req.statusCode;
    this.url = req.url;
  }
}
