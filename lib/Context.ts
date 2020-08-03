import { IncomingMessage, ServerResponse } from 'http';

export default class Context {
  headers: any;

  method?: string;

  statusCode?: number;

  url?: string;

  pathname: string = '';

  body: any = {};

  href: string = '';

  constructor(public req: IncomingMessage, public res: ServerResponse) {
    this.method = req.method;
    this.headers = req.headers;
    this.statusCode = req.statusCode;
    this.url = req.url;

    try {
      const url = `http://${req.headers.host}${req.url}`;
      const { pathname, href } = new URL(url);
      this.pathname = pathname;
      this.href = href;
    } catch (e) {
      console.log(e);
    }
  }
}
