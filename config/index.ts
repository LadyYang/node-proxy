export default {
  port: 80,

  server: ['http://localhost:8081', 'http://localhost:8082'],

  /** 最大只能是系统内核数 */
  concurrent: 3,
};
