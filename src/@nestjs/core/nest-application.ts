import "reflect-metadata"
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { Logger } from './logger';
import path from 'path';
import { CONSTRUCTOR_PARAMTYPES, INJECTED_TOKENS } from '@nestjs/common';
export class NestApplication<T> {
  // express 应用实例
  private readonly app: Express = express();
  // 依赖注入容器
  private readonly providers = new Map<any, any>()
  constructor(private readonly module: T) {
    this.app.use(express.json()) // 解析 json 格式的请求体
    this.app.use(express.urlencoded({ extended: true })) // 解析 urlencoded 格式的请求体
    this.app.use((req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
      // @ts-expect-error
      req.user = {
        username: "hang",
        age: 18,
      }
      next()
    })
    // 注入providers
    this.initProviders()
  }
  initProviders() {
    const providers = Reflect.getMetadata("providers", this.module) || []
    for (const provider of providers) {
      if (provider.provide && provider.useClass) {
        const dependencies = this.resolveDependencies(provider.useClass)
        const classInstance = new provider.useClass(...dependencies)
        this.providers.set(provider.provide, classInstance)
      } else if (provider.provide && provider.useValue) {
        this.providers.set(provider.provide, provider.useValue)
      } else if (provider.provide && provider.useFactory) {
        const inject = provider.inject || []
        this.providers.set(provider.provide, provider.useFactory(...inject.map(token => this.getProviderByToken(token))))
      } else {
        const dependencies = this.resolveDependencies(provider)
        this.providers.set(provider, new provider(...dependencies))
      }
    }
  }
  async init() {
    // 取出控制器
    const controllers = Reflect.getMetadata("controllers", this.module) || []
    Logger.log("AppModule dependencies initialized", 'InstanceLoader');
    // 处理路由配置
    for (const Controller of controllers) {
      // 解析控制器的依赖注入
      const dependencies = this.resolveDependencies(Controller)
      // 创建每个控制器的实例
      const controller = new Controller(...dependencies)
      // 获取路由前缀
      const prefix = Reflect.getMetadata('prefix', controller.constructor) || '/'
      Logger.log(`${Controller.name} {${prefix}}`, 'RoutesResolver');
      // 处理控制器中的方法
      for (const methodName of Object.getOwnPropertyNames(Reflect.getPrototypeOf(controller))) {
        // 拿到控制器中的每个函数
        const method = Reflect.getPrototypeOf(controller)[methodName]
        // 拿到HTTP方法 
        const httpMethod = Reflect.getMetadata("method", method)
        // 拿到路由路径
        const pathMetadata = Reflect.getMetadata("path", method)
        const redirectUrl = Reflect.getMetadata("redirectUrl", method)
        const redirectStatusCode = Reflect.getMetadata("redirectStatusCode", method)
        const statusCode = Reflect.getMetadata("statusCode", method) || 200
        const headers = Reflect.getMetadata("headers", method) || []
        if (!httpMethod) {
          continue
        }
        // 拼接路由路径
        const fullPath = path.posix.join("/", prefix, pathMetadata)
        // express 路由处理
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
      const { key, data, factory } = item
      const ctx = { // 因为nest不但支持http 还支持 graphql 微服务 web socket 等 兼容处理
        switchToHttp: () => ({
          getRequest: () => req,
          getResponse: () => res,
          getNext: () => next,
        })
      }
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
        case 'DecoratorFactory':
          return factory(data, ctx)
        default:
          return null
      }
    })
  }
  resolveResponseMetadata(controller: any, methodName: string) {
    const paramsMetadata = Reflect.getMetadata('params', controller, methodName) || []
    return paramsMetadata.filter(Boolean).find((item) => item.key === 'Res' || item.key === 'Response' || item.key === 'Next')
  }
  resolveDependencies(controller: any) {
    // 注入的token
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, controller) || []
    // 获取构造函数的参数
    const constructorParams = Reflect.getMetadata(CONSTRUCTOR_PARAMTYPES, controller) || []
    return constructorParams.map((param, index) => {
      //return this.providers.get(injectedTokens[index] || param)
      return this.getProviderByToken(injectedTokens[index] || param)
    })
  }
  getProviderByToken(token: any) {
    return this.providers.get(token) ?? token
  }
  async use(middleware) {
    this.app.use(middleware)
  }
  /**
   * 启动应用程序并监听指定端口
   * @param port 监听的端口号
   */
  async listen(port: number) {
    // 初始化应用程序
    await this.init()
    // 监听指定端口
    this.app.listen(port, () => {
      Logger.log(`Application is running on http://localhost:${port}`, 'NestApplication');
    });
  }
}
