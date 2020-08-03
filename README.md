# node-proxy

使用原生 Node 结合自己封装的 MyKoa 开发代理服务器

代理 form data 文件 get post cookie 等

支持多并发

支持负责均衡

# 开始

yarn dev

在配置文件中 config/index.ts

可以添加需要负载均衡的主机

代理服务器会计算每个主机总共的请求数来设置 weight

可设置 concurrent 来开启并发数
