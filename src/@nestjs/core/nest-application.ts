import express, { Express } from "express";
import { Logger } from ".";
export class NestApplication {
  // 内部私有化一个express实例
  private readonly app: Express = express()
  constructor(protected readonly module: any) {

  }

  /**
   * 初始化
   */
  async init() {

  }
  /**
   *  启动
   * @param port 端口号
   */
  async listen(port: number) {
    await this.init()
    // 调用express的listen方法 监听端口
    this.app.listen(port, () => {
      Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication')
    })
  }
}
