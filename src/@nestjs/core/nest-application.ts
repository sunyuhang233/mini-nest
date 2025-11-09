import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { Logger } from './logger';
import path from 'path';
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
      for (const methodName of Object.getOwnPropertyNames(Reflect.getPrototypeOf(controller))) {
        const method = Reflect.getPrototypeOf(controller)[methodName]
        const httpMethod = Reflect.getMetadata("method", method)
        const pathMetadata = Reflect.getMetadata("path", method)
        if (!httpMethod) {
          continue
        }
        const fullPath = path.posix.join("/", prefix, pathMetadata)
        this.app[httpMethod.toLowerCase()](fullPath, (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
          // 解析参数
          const args = this.resolveParams(controller, methodName, req, res, next)
          const result = method.call(controller, ...args)
          res.send(result)
        })
        Logger.log(`Mapped {${fullPath}}, ${httpMethod} route`, 'RoutesResolver');
      }
    }
    Logger.log("Nest application successfully started", 'NestApplication');
  }
  resolveParams(controller: any, methodName: string, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
    const paramsMetadata = Reflect.getMetadata('params', controller, methodName) || []
    return paramsMetadata.sort((a, b) => a.parameterIndex - b.parameterIndex).map((item) => {
      const { key } = item
      switch (key) {
        case 'Request':
        case 'Req':
          return req
        default:
          return null
      }
    })
  }
  async listen(port: number) {
    await this.init()
    this.app.listen(port, () => {
      Logger.log(`Application is running on http://localhost:${port}`, 'NestApplication');
    });
  }
}
