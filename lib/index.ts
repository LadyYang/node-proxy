/*
 * @Description:
 * @Author: chtao
 * @Github: https://github.com/LadyYang
 * @Email: 1763615252@qq.com
 * @Date: 2020-07-29 20:14:52
 * @LastEditTime: 2020-08-03 15:17:57
 * @LastEditors: chtao
 * @FilePath: \node-proxy\lib\index.ts
 */

import http, { Server } from 'http';

import { compose } from '../utils';
import Context from './Context';

type middlewareType = (ctx: Context, next: () => void) => Promise<void>;

type wrapMiddlewreType = (
  ctx: Context
) => (next: () => void) => () => Promise<void>;

export default class MyKoa {
  private server: Server;

  private middlewares: wrapMiddlewreType[] = [];

  constructor() {
    this.server = http.createServer(async (req, res) => {
      try {
        const ctx = new Context(req, res);

        const { pathname } = new URL(`http://${ctx.headers.host}${req.url}`);

        ctx.pathname = pathname;

        // 传入上下文对象
        const chain = this.middlewares.map((fn: wrapMiddlewreType) => fn(ctx));

        const middleware = compose(...chain)();

        // 启动
        await middleware();
      } catch (e) {
        console.log(e);
      }
    });
  }

  public listen(port: number, listener?: () => void) {
    this.server.listen(port, listener);
  }

  /** 注册中间件 */
  public use(middleware: middlewareType) {
    // 包裹成三层模型
    const wrap = (ctx: Context) => (next: () => void) => async () => {
      if (typeof next !== 'function') next = () => {};

      return await middleware.call(null, ctx, next);
    };

    this.middlewares.push(wrap);
  }
}
