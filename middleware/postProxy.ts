import Context from '../lib/Context';
import { Next } from '../lib';
import { request } from 'http';

export default async (ctx: Context, next: Next) => {
  if (ctx.method === 'POST') {
    const req = request(ctx.targetServer + ctx.url, { method: 'POST' }, res => {
      // 代理响应头
      for (let [k, v] of Object.entries(res.headers)) {
        ctx.res.setHeader(k, v as any);
      }

      res.pipe(ctx.res);

      res.on('error', e => console.log(e));
    });

    // 代理请求头
    for (let [k, v] of Object.entries(ctx.headers)) {
      req.setHeader(k, v as any);
    }

    ctx.req.on('data', chunk => {
      req.write(chunk);
    });

    ctx.req.on('end', () => req.end());

    req.on('error', e => console.log(e));
  } else {
    await next();
  }
};
