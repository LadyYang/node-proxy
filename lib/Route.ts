import Context from "./Context";

export default class Route {
  private prefix?: string;
  private postRoutes = new Map();
  private getRoutes = new Map();

  constructor(prefix?: string) {
    this.prefix = prefix;
  }

  post(pathname: string, handler: (ctx: Context) => void) {
    const newPathname = this.prefix ? this.prefix + pathname : pathname;

    this.postRoutes.set(newPathname, handler);
  }

  get(pathname: string, handler: (ctx: Context) => void) {
    const newPathname = this.prefix ? this.prefix + pathname : pathname;

    this.getRoutes.set(newPathname, handler);
  }

  async _registerRoute(ctx: Context, next: any) {
    let handler: any = null;

    switch (ctx.method) {
      case "GET":
        handler = this.getRoutes.get(ctx.pathname);

        console.log(ctx.pathname);
        if (handler) {
          handler(ctx);
          return;
        }
        break;
      case "POST":
        handler = this.postRoutes.get(ctx.pathname);
        if (handler) {
          handler(ctx);
          return;
        }
        break;
      default:
        break;
    }

    next();
  }

  registerRoute = this._registerRoute.bind(this);
}
