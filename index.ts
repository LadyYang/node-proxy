/*
 * @Description:
 * @Author: chtao
 * @Github: https://github.com/LadyYang
 * @Email: 1763615252@qq.com
 * @Date: 2020-08-03 14:47:58
 * @LastEditTime: 2020-08-03 15:33:07
 * @LastEditors: chtao
 * @FilePath: \node-proxy\index.ts
 */

import MyKoa from './lib';
import getProxy from './middleware/getProxy';
import postProxy from './middleware/postProxy';

const app = new MyKoa();

app.use(getProxy);
app.use(postProxy);

app.listen(80, () => console.log('代理服务器启动成功，正在监听端口：80'));
