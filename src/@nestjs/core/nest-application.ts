import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { Logger } from './logger';
import path from 'path';
export class NestApplication {
  private readonly app: Express = express();
  constructor(private readonly module: any) {
    this.app.use(express.json()) // 解析 json 格式的请求体
    this.app.use(express.urlencoded({ extended: true })) // 解析 urlencoded 格式的请求体
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
        const redirectUrl = Reflect.getMetadata("redirectUrl", method)
        const redirectStatusCode = Reflect.getMetadata("redirectStatusCode", method)
        const statusCode = Reflect.getMetadata("statusCode", method) || 200
        const headers = Reflect.getMetadata("headers", method) || []
        if (!httpMethod) {
          continue
        }
        const fullPath = path.posix.join("/", prefix, pathMetadata)
        this.app[httpMethod.toLowerCase()](fullPath, (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
          // 解析参数
          const args = this.resolveParams(controller, methodName, req, res, next)
          const result = method.call(controller, ...args)
          const responseMetadata = this.resolveResponseMetadata(controller, methodName)
          // 优先检查是否需要重定向（基于方法返回值）
          if (result?.url) {
            res.redirect(result.statusCode || 302, result.url)
            return
          }
          // 其次检查是否有路由级别的重定向配置
          if (redirectUrl) {
            res.redirect(redirectStatusCode || 302, redirectUrl)
            return
          }
          if (statusCode) {
            res.statusCode = statusCode
          } else if (httpMethod === 'POST') {
            res.statusCode = 201
          }
          // 如果没有注入 Response 装饰器 或者 开启 passthrough 模式，则由Nest处理响应
          if (!responseMetadata || (responseMetadata?.data?.passthrough)) {
            headers.forEach((item) => {
              res.setHeader(item.key, item.value)
            })
            res.send(result)
          }
        })
        Logger.log(`Mapped {${fullPath}}, ${httpMethod} route`, 'RoutesResolver');
      }
    }
    Logger.log("Nest application successfully started", 'NestApplication');
  }
  resolveParams(controller: any, methodName: string, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
    const paramsMetadata = Reflect.getMetadata('params', controller, methodName) || []
    return paramsMetadata.map((item) => {
      const { key, data } = item
      switch (key) {
        case 'Request':
        case 'Req':
          return req
        case "Query":
          return data ? req.query[data] : req.query
        case "Headers":
          return data ? req.headers[data] : req.headers
        case "Session":
          // @ts-expect-error
          return data ? req.session[data] : req.session
        case "Ip":
          return req.ip
        case "Param":
          return data ? req.params[data] : req.params
        case "Body":
          return data ? req.body[data] : req.body
        case "Res":
        case "Response":
          return res
        case "Next":
          return next
        default:
          return null
      }
    })
  }
  resolveResponseMetadata(controller: any, methodName: string) {
    const paramsMetadata = Reflect.getMetadata('params', controller, methodName) || []
    return paramsMetadata.filter(Boolean).find((item) => item.key === 'Res' || item.key === 'Response' || item.key === 'Next')
  }
  async use(middleware) {
    this.app.use(middleware)
  }
  async listen(port: number) {
    await this.init()
    this.app.listen(port, () => {
      Logger.log(`Application is running on http://localhost:${port}`, 'NestApplication');
    });
  }
}
