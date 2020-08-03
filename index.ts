/*
 * @Description:
 * @Author: chtao
 * @Github: https://github.com/LadyYang
 * @Email: 1763615252@qq.com
 * @Date: 2020-08-03 14:47:58
 * @LastEditTime: 2020-08-03 22:37:53
 * @LastEditors: chtao
 * @FilePath: \node-proxy\index.ts
 */
import { isMaster, fork, workers } from 'cluster';
import { cpus } from 'os';

import MyKoa from './lib';
import getProxy from './middleware/getProxy';
import postProxy from './middleware/postProxy';
import config from './config';

if (isMaster) {
  const num =
    config.concurrent > cpus().length ? cpus().length : config.concurrent;

  // 开启多进程
  for (let i = 0; i < num; i++) {
    fork();
  }

  // 子进程共享
  const serverArr: any[] = config.server.reduce((arr, server) => {
    arr.push({ host: server, weight: 0 });
    return arr;
  }, [] as any);

  for (let id in workers) {
    const worker = workers[id];

    // 实现负载均衡
    worker?.on('message', action => {
      if (action.type === 'GET_SERVER') {
        // 从队列中选择一个 server weight 最小，之后 weight++
        serverArr.sort(
          (
            server1: { host: string; weight: number },
            server2: { host: string; weight: number }
          ) => server1.weight - server2.weight
        );

        serverArr[0].weight++;
        worker.send(serverArr[0].host);
      }

      // 连接断开 weight--
      if (action.type === 'FINISH') {
        const target = serverArr.find(server => server.host === action.payload);

        target.weight--;
      }
    });
  }
} else {
  const app = new MyKoa();

  app.use(async (ctx, next) => {
    // 向主进程 请求 targetServer
    process.send?.({ type: 'GET_SERVER' });

    // 不能使用 on 进行监听
    process.once('message', async server => {
      ctx.targetServer = server;

      ctx.res.once('finish', () => {
        process.send?.({ type: 'FINISH', payload: server });
      });

      await next();
    });
  });

  app.use(getProxy);
  app.use(postProxy);

  app.listen(config.port, () =>
    console.log(`代理服务器 pid: ${process.pid}，正在监听端口：${config.port}`)
  );
}
