import express, { Express } from 'express';
import { Logger } from './logger';
export class NestApplication {
  private readonly app: Express = express();
  constructor(private readonly module: any) {
  }
  async init() {
    // 取出控制器 处理路由配置
    const controllers = Reflect.getMetadata("controllers", this.module) || []
    Logger.log("AppModule dependencies initialized", 'InstanceLoader');
    for (const Controller of controllers) {
      // 创建每个控制器的实例
      const controller = new Controller()
      // 获取路由前缀
      const prefix = Reflect.getMetadata('prefix', controller.constructor) || '/'
      Logger.log(`${Controller.name} {${prefix}}`, 'RoutesResolver');
    }
  }
  async listen(port: number) {
    await this.init()
    this.app.listen(port, () => {
      Logger.log(`Application is running on http://localhost:${port}`, 'NestApplication');
    });
  }
}
