/*
 * @Description:
 * @Author: chtao
 * @Github: https://github.com/LadyYang
 * @Email: 1763615252@qq.com
 * @Date: 2020-07-29 20:14:52
 * @LastEditTime: 2020-08-03 17:14:49
 * @LastEditors: chtao
 * @FilePath: \node-proxy\lib\index.ts
 */

import http, { Server } from 'http';

import { compose } from '../utils';
import Context from './Context';

export type Next = (...args: any[]) => Promise<any>;

type MiddlewareType = (
  ctx: Context,
  next: Next,
  ...args: any[]
) => Promise<any>;

type WrapMiddlewreType = (ctx: Context) => (next: Next) => () => Promise<any>;

export default class MyKoa {
  private server: Server;

  private middlewares: WrapMiddlewreType[] = [];

  constructor() {
    this.server = http.createServer(async (req, res) => {
      try {
        const ctx = new Context(req, res);

        // 传入上下文对象
        const chain = this.middlewares.map((fn: WrapMiddlewreType) => fn(ctx));

        const next = compose(...chain)('hh');

        // 启动
        await next();
      } catch (e) {
        console.log(e);
      }
    });
  }

  public listen(port: number, listener?: () => void) {
    this.server.listen(port, listener);
  }

  /** 注册中间件 */
  public use(middleware: MiddlewareType) {
    // 包裹成三层模型
    const wrap = (ctx: Context) => (next: Next) => async (...args: any[]) => {
      if (typeof next !== 'function') next = async () => {};

      return await middleware.call(null, ctx, next, ...args);
    };

    this.middlewares.push(wrap);
  }
}
