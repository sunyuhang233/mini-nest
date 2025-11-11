import "reflect-metadata"
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { Logger } from './logger';
import path from 'path';
import { CONSTRUCTOR_PARAMTYPES, INJECTED_TOKENS } from '@nestjs/common';
export class NestApplication<T> {
  // express 应用实例
  private readonly app: Express = express();
  // 依赖注入容器
  //private readonly providers = new Map<any, any>()
  // 保存所有的provider实例 值就是类的实例或者值
  private readonly providerInstances = new Map<any, any>()
  // 记录每个模块里有哪些providers的token
  private readonly moduleProviders = new Map<any, any>()
  // 记录全局providers的token
  private readonly globalProviders = new Set();
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
  /**
   * 初始化依赖注入容器
   */
  initProviders() {
    // 初始化imports
    const imports = Reflect.getMetadata("imports", this.module) || []
    // 遍历导入的模块
    for (const importedModule of imports) {
      this.registerProvidersFromModule(importedModule, this.module);
    }
    // 获取当前模块的providers
    const providers = Reflect.getMetadata("providers", this.module) || []
    // 遍历添加到providers
    for (const provider of providers) {
      this.addProvider(provider, this.module)
    }
  }
  /**
   * 从模块中注册providers
   * @param module 要注册providers的模块
   */
  registerProvidersFromModule(module: any, ...parentModules: any[]) {
    const providers = Reflect.getMetadata("providers", module) || []
    const exports = Reflect.getMetadata('exports', module) || [];
    const global = Reflect.getMetadata('global', module) || false
    for (const exportToken of exports) {
      // 判断是否是模块 如果是模块 则递归注册providers
      if (this.isModule(exportToken)) {
        this.registerProvidersFromModule(exportToken, module, ...parentModules)
      } else {
        // 不是模块 则直接添加到providers
        const provider = providers.find(provider => provider === exportToken || provider.provide === exportToken);
        if (provider) {
          [module, ...parentModules].forEach(module => {
            this.addProvider(provider, module, global)
          })
        }
      }
    }
  }
  /**
   * 判断是否为模块
   * @param injectToken 要判断的token
   * @returns 是否为模块
   */
  isModule(injectToken) {
    return injectToken && injectToken instanceof Function && Reflect.getMetadata('isModule', injectToken)
  }
  /**
   * 添加一个provider到依赖注入容器
   * 原来的providers都混在一起 现在需要进行隔离 每个模块都有自己的providers
   * @param provider 要添加的provider
   * @param module 要添加到的模块
   */
  addProvider(provider: any, module: any, global: boolean = false) {
    // 代表module这个模块对应的providers的token集合
    const providers = global ? this.globalProviders : (this.moduleProviders.get(module) || new Set());
    if (!this.moduleProviders.has(module)) {
      this.moduleProviders.set(module, providers)
    }
    const injectToken = provider.provide ?? provider;
    if (this.providerInstances.has(injectToken)) {
      if (!providers.has(injectToken)) {
        providers.add(injectToken)
      }
      return
    }
    // 1.写法为{provide: 'token', useClass: MyService}
    // const injectToken = provider.provide || provider
    // if (this.providers.has(injectToken)) return
    if (provider.provide && provider.useClass) {
      const dependencies = this.resolveDependencies(provider.useClass)
      const classInstance = new provider.useClass(...dependencies)
      this.providerInstances.set(provider.provide, classInstance)
      providers.add(provider.provide)
      // 2.写法为{provide: MyService, useValue: new MyService()}
    } else if (provider.provide && provider.useValue) {
      this.providerInstances.set(provider.provide, provider.useValue)
      providers.add(provider.provide)
      // 3.写法为{provide: MyService, useFactory: () => new MyService()}
    } else if (provider.provide && provider.useFactory) {
      const inject = provider.inject || []
      this.providerInstances.set(provider.provide, provider.useFactory(...inject.map(token => this.getProviderByToken(token, module))))
      providers.add(provider.provide)
      // 4.其他写法
    } else {
      const dependencies = this.resolveDependencies(provider)
      const classInstance = new provider(...dependencies);
      this.providerInstances.set(provider, classInstance);
      providers.add(provider)
    }
  }
  /**
   * 初始化应用程序
   */
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
        // 拿到重定向地址
        const redirectUrl = Reflect.getMetadata("redirectUrl", method)
        // 拿到重定向状态码
        const redirectStatusCode = Reflect.getMetadata("redirectStatusCode", method)
        // 拿到状态码
        const statusCode = Reflect.getMetadata("statusCode", method) || 200
        // 拿到响应头
        const headers = Reflect.getMetadata("headers", method) || []
        // 检查是否有HTTP方法
        if (!httpMethod) {
          continue
        }
        // 拼接路由路径
        const fullPath = path.posix.join("/", prefix, pathMetadata)
        // express 路由处理
        this.app[httpMethod.toLowerCase()](fullPath, (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
          // 解析参数
          const args = this.resolveParams(controller, methodName, req, res, next)
          // 获取运行后结果
          const result = method.call(controller, ...args)
          // 解析响应元数据（res response next 等信息）
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
          // 检查状态码
          if (statusCode) {
            res.statusCode = statusCode
          } else if (httpMethod === 'POST') {
            res.statusCode = 201
          }
          // 如果没有注入 Response 装饰器 或者 开启 passthrough 模式，则由Nest处理响应
          if (!responseMetadata || (responseMetadata?.data?.passthrough)) {
            // 处理响应头
            headers.forEach((item: { key: string, value: string }) => {
              res.setHeader(item.key, item.value)
            })
            // 处理响应体
            res.send(result)
          }
        })
        Logger.log(`Mapped {${fullPath}}, ${httpMethod} route`, 'RoutesResolver');
      }
    }
    Logger.log("Nest application successfully started", 'NestApplication');
  }
  /**
   * 解析参数
   * @param controller 控制器实例
   * @param methodName 方法名
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件函数
   * @returns 参数列表
   */
  resolveParams(controller: Function, methodName: string, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
    // 获取参数列表
    const paramsMetadata = Reflect.getMetadata('params', controller, methodName) || []
    // 解析参数
    return paramsMetadata.map((item) => {
      const { key, data, factory } = item
      // 因为nest不但支持http 还支持 graphql 微服务 web socket 等 兼容处理
      const ctx = {
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
  /**
   * 解析响应元数据（res response next 等信息）
   * @param controller 控制器实例
   * @param methodName 方法名
   * @returns 响应元数据
   */
  resolveResponseMetadata(controller: Function, methodName: string) {
    const paramsMetadata = Reflect.getMetadata('params', controller, methodName) || []
    return paramsMetadata.filter(Boolean).find((item) => item.key === 'Res' || item.key === 'Response' || item.key === 'Next')
  }
  /**
   * 解析依赖注入
   * @param controller 控制器实例
   * @returns 依赖注入的实例列表
   */
  resolveDependencies(controller: Function) {
    // 注入的token
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, controller) || []
    // 获取构造函数的参数
    const constructorParams = Reflect.getMetadata(CONSTRUCTOR_PARAMTYPES, controller) || []
    return constructorParams.map((param, index) => {
      //return this.providers.get(injectedTokens[index] || param)
      const module = Reflect.getMetadata("nestModule", controller)
      const injectedToken = injectedTokens[index] ?? param;
      return this.getProviderByToken(injectedToken, module);
    })
  }
  /**
   * 根据token获取依赖注入的实例
   * @param token 依赖注入的token
   * @returns 依赖注入的实例
   */
  getProviderByToken(injectedToken: string | symbol, module) {
    if (this.globalProviders.has(injectedToken)) {
      return this.providerInstances.get(injectedToken);
    } else if (this.moduleProviders.get(module)?.has(injectedToken)) {
      return this.providerInstances.get(injectedToken);
    }
  }
  /**
   * 注册中间件
   * @param middleware 中间件函数
   */
  async use(middleware: any) {
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
