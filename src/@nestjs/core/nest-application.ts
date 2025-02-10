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
    // 取出模块中的所有控制器 进行路由配置
    const controllers = Reflect.getMetadata('controllers', this.module) || []
    Logger.log(`AppModule dependencies initialized`, 'InstanceLoader')
    for (const Controller of controllers) {
      // 创建每一个控制器的实例
      const controller = new Controller()
      // 获取每个控制器的前缀
      const prefix = Reflect.getMetadata('prefix', Controller) || '/'
      // 解析路由
      Logger.log(`${Controller.name} {${prefix}}`, 'RoutesResolver')
    }
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
