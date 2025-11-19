import "reflect-metadata"
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { Logger } from './logger';
import path from 'path';
import { ArgumentsHost, CONSTRUCTOR_PARAMTYPES, defineModule, ExecutionContext, GlobalHttpExceptionFilter, HttpException, HttpStatus, INJECTED_TOKENS, NestInterceptor, RequestMethod, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from "./constants";
import { PipeTransform } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { Reflector } from "./reflector";
import { from, mergeMap, Observable, of } from "rxjs";
export class NestApplication {
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
  // 记录中间件 可能是中间件的类 也可能是中间件的实例 也可能是函数中间件
  private readonly middlewares = []
  // 记录排除的路由
  private readonly excludedRoutes = []
  // 添加全局异常过滤器
  private defaultGlobalExceptionFilter = new GlobalHttpExceptionFilter()
  // 全局异常过滤器数组
  private globalHttpExceptionFilters = []
  // 全局管道数组
  private globalPipes: PipeTransform[] = []
  // 全局守卫
  private globalGuards: CanActivate[] = []
  // 全局拦截器数组
  private readonly globalInterceptors: NestInterceptor[] = [];

  constructor(private readonly module: any) {
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
    defineModule(this.module, [this.defaultGlobalExceptionFilter])
  }

  /**
   * 添加全局拦截器
   * @param interceptors 全局拦截器数组
   */
  useGlobalInterceptors(...interceptors: NestInterceptor[]) {
    this.globalInterceptors.push(...interceptors)
  }

  /**
   * 添加全局守卫
   * @param guards 全局守卫数组
   */
  useGlobalGuards(...guards: CanActivate[]) {
    this.globalGuards.push(...guards)
  }
  /**
   * 添加全局管道
   * @param pipes 全局管道数组
   */
  useGlobalPipes(...pipes: PipeTransform[]) {
    this.globalPipes.push(...pipes)
  }
  /**
   * 添加全局异常过滤器
   * @param filters 异常过滤器数组
   * @returns 
   */
  useGlobalFilters(...filters: Function[]) {
    this.globalHttpExceptionFilters.push(...filters)
    defineModule(this.module, filters.filter((filter) => filter instanceof Function))
    return this
  }
  /**
   * 初始化中间件
   */
  async initMiddlewares() {
    await this.module.prototype.configure?.(this)
  }
  /**
   * 应用中间件
   * @param mids 中间件数组
   * @returns 
   */
  apply(...mids: any[]) {
    // 定义模块 并将中间件添加到模块中
    defineModule(this.module, mids)
    this.middlewares.push(...mids)
    return this
  }
  /**
   * 应用中间件到指定路由
   * @param routes 路由数组
   */
  forRoutes(...routes) {
    for (const route of routes) {
      for (const mid of this.middlewares) {
        const { routePath, routeMethod } = this.normalizeRouteInfo(route)
        this.app.use(routePath, (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
          // 如果路由在排除列表中 则跳过
          if (this.isExcluded(req.originalUrl, req.method as RequestMethod)) {
            next()
            return
          }
          if (routeMethod === RequestMethod.ALL || routeMethod === req.method) {
            // 可能是中间件的类 也可能是中间件的实例 也可能是函数中间件
            if ('use' in mid.prototype || 'use' in mid) { // 传递的是类中间件
              const middlewareInstance = this.getMiddlewareInstance(mid)
              middlewareInstance.use(req, res, next)
            } else if (mid instanceof Function) { // 传递的是函数中间件
              mid(req, res, next)
            } else { // 传递是其他类型
              next()
            }
          } else {
            next()
          }
        })
      }
    }
    // 清空上一次的中间件
    this.middlewares.length = 0
    return this
  }
  /**
 * 排除指定路由
 * @param routes 路由数组
 * @returns 
 */
  exclude(...routes) {
    this.excludedRoutes.push(...routes.map(this.normalizeRouteInfo))
    return this
  }
  /**
   * 判断路由是否被排除
   * @param routePath 路由路径
   * @param routeMethod 路由方法
   * @returns 是否被排除
   */
  isExcluded(routePath: string, routeMethod: RequestMethod) {
    return this.excludedRoutes.some((route) => {
      const { routePath: excludedPath, routeMethod: excludedMethod } = route
      return routePath === excludedPath && (excludedMethod === RequestMethod.ALL || excludedMethod === routeMethod)
    })
  }
  /**
   * 获取中间件实例
   * @param mid 中间件类或函数
   * @returns 中间件实例
   */
  getMiddlewareInstance(mid) {
    if (mid instanceof Function) {
      const dependencies = this.resolveDependencies(mid)
      return new mid(...dependencies)
    }
    return mid
  }
  /**
   * 解析路由信息
   * @param route 路由对象
   * @returns 路由路径和方法
   */
  normalizeRouteInfo(route: any) {
    let routePath = ''
    let routeMethod = RequestMethod.ALL
    if (typeof route === 'string') { // 传递的是路径string
      routePath = route
    } else if ('path' in route) { // 传递的是对象 包含path和method {path: '/api', method: RequestMethod.GET}
      routePath = route.path
      routeMethod = route.method || RequestMethod.ALL
    } else if (route instanceof Function) { // 传递的是控制器类 则获取其prefix
      routePath = Reflect.getMetadata("prefix", route) || ""
    }
    routePath = path.posix.join('/', routePath)
    return { routePath, routeMethod }
  }
  /**
   * 添加默认的providers
   */
  addDefaultProviders() {
    // 添加默认的providers
    this.addProvider(Reflector, this.module, true)
  }
  /**
   * 初始化依赖注入容器
   */
  async initProviders() {
    this.addDefaultProviders()
    // 初始化imports
    const imports = Reflect.getMetadata("imports", this.module) || []
    // 遍历导入的模块
    for (const importModule of imports) {
      let importModuleOrPromise = importModule
      // 如果导入的是一个promise 则等待它resolve
      if (importModuleOrPromise instanceof Promise) {
        importModuleOrPromise = await importModuleOrPromise
      }
      // 区分是否是动态模块 根据module属性来区分
      if ('module' in importModuleOrPromise) {
        // 获取动态模块的providers和exports
        const { module, providers, exports, controllers } = importModuleOrPromise
        // 合并动态模块的providers和exports
        const newProviders = [...(Reflect.getMetadata("providers", module) || []), ...(providers || [])]
        const newExports = [...(Reflect.getMetadata("exports", module) || []), ...(exports || [])]
        // 合并动态模块的controllers
        const newControllers = [...(Reflect.getMetadata("controllers", module) || []), ...(controllers || [])]
        // 更新动态模块的providers和exports
        defineModule(module, newProviders)
        defineModule(module, newControllers)
        // 更新动态模块的controllers
        Reflect.defineMetadata("controllers", newControllers, module)
        Reflect.defineMetadata("providers", newProviders, module)
        Reflect.defineMetadata("exports", newExports, module)
        this.registerProvidersFromModule(module, this.module);
      } else {
        this.registerProvidersFromModule(importModuleOrPromise, this.module);
      }
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
    this.initControllers(module)
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
    // global 为true的情况就是全局providers 否则就是模块providers
    const providers = global ? this.globalProviders : (this.moduleProviders.get(module) || new Set());
    if (!global) {
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
   * 初始化Controller
   */
  async initControllers(module) {
    // 取出控制器
    const controllers = Reflect.getMetadata("controllers", module) || []
    Logger.log("AppModule dependencies initialized", 'InstanceLoader');
    // 处理路由配置
    for (const Controller of controllers) {
      // 解析控制器的依赖注入
      const dependencies = this.resolveDependencies(Controller)
      // 创建每个控制器的实例
      const controller = new Controller(...dependencies)
      // 获取控制器的异常过滤器
      const controllerFilters = Reflect.getMetadata('filters', controller.constructor) || []
      defineModule(this.module, controllerFilters)
      // 获取控制器的管道
      const controllerPipes = Reflect.getMetadata('pipes', controller.constructor) || []
      // 获取控制器的守卫
      const controllerGuards = Reflect.getMetadata('guards', controller.constructor) || []
      // 获取控制器的拦截器
      const controllerInterceptors = Reflect.getMetadata('interceptors', controller.constructor) || []
      // 获取路由前缀
      const prefix = Reflect.getMetadata('prefix', controller.constructor) || '/'
      Logger.log(`${Controller.name} {${prefix}}`, 'RoutesResolver');
      // 处理控制器中的方法
      for (const methodName of Object.getOwnPropertyNames(Reflect.getPrototypeOf(controller))) {
        // 拿到控制器中的每个函数
        const method = Reflect.getPrototypeOf(controller)[methodName]
        // 获取方法的异常过滤器
        const methodFilters = Reflect.getMetadata('filters', method) || []
        defineModule(this.module, methodFilters)
        // 获取方法的管道
        const methodPipes = Reflect.getMetadata('pipes', method) || []
        // 合并控制器和方法的管道
        const allPipes = [...controllerPipes, ...methodPipes]
        // 合并控制器和方法的异常过滤器
        const allFilters = [...methodFilters, ...controllerFilters]
        // 获取方法的守卫
        const methodGuards = Reflect.getMetadata('guards', method) || []
        // 合并控制器和方法的守卫
        const allGuards = [...this.globalGuards, ...controllerGuards, ...methodGuards]
        // 获取方法的拦截器
        const methodInterceptors = Reflect.getMetadata('interceptors', method) || []
        // 合并控制器和方法的拦截器
        const allInterceptors = [...this.globalInterceptors, ...controllerInterceptors, ...methodInterceptors]
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
        this.app[httpMethod.toLowerCase()](fullPath, async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
          const ctx = {
            switchToHttp: () => ({
              getRequest: () => req,
              getResponse: () => res,
              getNext: () => next,
            })
          }
          try {
            const context = {
              ...ctx,
              getClass: () => Controller,
              getHandler: () => method,
            }
            // 检查守卫
            await this.callGuards(allGuards, context as ExecutionContext)
            // 解析参数
            const args = await this.resolveParams(controller, methodName, req, res, next, allPipes)
            this.callInterceptors(controller, method, args, allInterceptors, context).subscribe((result) => {
              // 获取运行后结果
              //const result = await method.call(controller, ...args)
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
          } catch (error) {
            // 处理异常
            this.callExceptionFilters(error, ctx, allFilters)
          }
        })
        Logger.log(`Mapped {${fullPath}}, ${httpMethod} route`, 'RoutesResolver');
      }
    }
    Logger.log("Nest application successfully started", 'NestApplication');
  }
  /**
   * 调用拦截器
   * @param controller 控制器实例
   * @param methodName 方法名
   * @param args 方法参数
   * @param allInterceptors 所有拦截器列表
   * @param context 执行上下文
   */
  callInterceptors(controller, method, args, allInterceptors, context) {
    const nextFn = (i = 0): Observable<any> => {
      if (i >= allInterceptors.length) {
        const result = method.call(controller, ...args);
        return result instanceof Promise ? from(result) : of(result);
      }
      const handler = {
        handle: () => nextFn(i + 1),
      };
      const interceptorInstance = this.getInterceptorInstance(allInterceptors[i]);
      const result = interceptorInstance.intercept(context, handler);
      return from(result).pipe(mergeMap(res => res instanceof Observable ? res : of(res)));
    };
    return nextFn();
  }
  /**
   * 获取拦截器实例
   * @param interceptor 拦截器类或实例
   * @returns 拦截器实例
   */
  getInterceptorInstance(interceptor: any) {
    if (interceptor instanceof Function) {
      const dependencies = this.resolveDependencies(interceptor)
      return new interceptor(...dependencies)
    }
    return interceptor
  }
  /**
   * 调用守卫
   * @param guards 守卫列表
   * @param context 执行上下文
   */
  async callGuards(guards: CanActivate[], context: ExecutionContext) {
    // 遍历守卫列表
    for (const guard of guards) {
      // 检查守卫是否通过
      const guardInstance = this.getGuardInstance(guard)
      const canActivate = await guardInstance.canActivate(context)
      if (!canActivate) {
        // 守卫未通过，抛出异常
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      }
    }
  }
  /**
   * 获取守卫实例
   * @param guard 守卫类或实例
   * @returns 守卫实例
   */
  getGuardInstance(guard: any) {
    if (guard instanceof Function) {
      const dependencies = this.resolveDependencies(guard)
      return new guard(...dependencies)
    }
    return guard
  }
  /**
   * 调用异常过滤器
   * @param error 异常对象
   */
  callExceptionFilters(error: any, host: any, filters: GlobalHttpExceptionFilter[]) {
    // 调用全局异常过滤器
    // 先按照方法 再是类 再是全局 再是默认
    const allFilters = [...filters, ...this.globalHttpExceptionFilters, this.defaultGlobalExceptionFilter]
    for (const filter of allFilters) {
      let filterInstance = this.getFilterInstance(filter)
      const exception = Reflect.getMetadata("catch", filterInstance.constructor) || []
      // 检查异常过滤器是否匹配当前异常类型
      if (exception.length === 0 || exception.some((item: any) => error instanceof item)) {
        filterInstance.catch(error, host)
        // 异常已处理，跳出循环
        break
      }
    }
  }
  /**
   * 获取异常过滤器实例
   * @param filter 异常过滤器类或实例
   * @returns 异常过滤器实例
   */
  getFilterInstance(filter: any) {
    if (filter instanceof Function) {
      const dependencies = this.resolveDependencies(filter)
      return new filter(...dependencies)
    }
    return filter
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
  async resolveParams(controller: Function, methodName: string, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction, paramPipes: any[]) {
    // 获取参数列表
    const paramsMetadata = Reflect.getMetadata('params', controller, methodName) || []
    // 解析参数
    return Promise.all(paramsMetadata.map(async (item) => {
      let { key, data, factory, pipes = [], metatype } = item
      // 因为nest不但支持http 还支持 graphql 微服务 web socket 等 兼容处理
      const ctx = {
        switchToHttp: () => ({
          getRequest: () => req,
          getResponse: () => res,
          getNext: () => next,
        })
      }
      let value
      switch (key) {
        case 'Request':
        case 'Req':
          value = req
          break
        case "Query":
          value = data ? req.query[data] : req.query
          break
        case "Headers":
          value = data ? req.headers[data] : req.headers
          break
        case "Session":
          // @ts-expect-error
          value = data ? req.session[data] : req.session
          break
        case "Ip":
          value = req.ip
          break
        case "Param":
          value = data ? req.params[data] : req.params
          break
        case "Body":
          value = data ? req.body[data] : req.body
          break
        case "Res":
        case "Response":
          value = res
          break
        case "Next":
          value = next
          break
        case 'DecoratorFactory':
          value = factory(data, ctx)
          break
        default:
          value = null
          break
      }
      for (const pipe of [...this.globalPipes, ...pipes, ...paramPipes]) {
        const pipeIns = await this.getPipeInstance(pipe)
        const type = key === 'DecoratorFactory' ? 'custom' : key.toLowerCase()
        value = await pipeIns.transform(value, { type, data, metatype })
      }
      return value
    }))
  }
  /**
   * 获取管道实例
   * @param pipe 管道类或实例
   * @returns 管道实例
   */
  getPipeInstance(pipe) {
    if (pipe instanceof Function) {
      const dependencies = this.resolveDependencies(pipe)
      return new pipe(...dependencies)
    }
    return pipe
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
   * 初始化全局异常过滤器
   */
  async initGlobalFilters() {
    const providers = Reflect.getMetadata('providers', this.module) || []
    for (const provider of providers) {
      if (provider.provide === APP_FILTER) {
        const filterInstance = this.getProviderByToken(APP_FILTER, this.module)
        this.useGlobalFilters(filterInstance)
      }
    }
  }
  /**
   * 初始化全局管道
   */
  async initGlobalPipes() {
    const providers = Reflect.getMetadata('providers', this.module) || []
    for (const provider of providers) {
      if (provider.provide === APP_PIPE) {
        const pipeInstance = this.getProviderByToken(APP_PIPE, this.module)
        this.useGlobalPipes(pipeInstance)
      }
    }
  }
  /**
   * 初始化全局守卫
   */
  async initGlobalGuards() {
    const providers = Reflect.getMetadata('providers', this.module) || []
    for (const provider of providers) {
      if (provider.provide === APP_GUARD) {
        const guardInstance = this.getProviderByToken(APP_GUARD, this.module)
        this.useGlobalGuards(guardInstance)
      }
    }
  }
  /**
   * 启动应用程序并监听指定端口
   * @param port 监听的端口号
   */
  async listen(port: number) {
    // 注入providers
    await this.initProviders()
    // 初始化中间件
    await this.initMiddlewares()
    // 初始化异常过滤器
    await this.initGlobalFilters()
    // 初始化全局管道
    await this.initGlobalPipes()
    // 初始化全局守卫
    await this.initGlobalGuards()
    // 初始化应用程序
    await this.initControllers(this.module)
    // 监听指定端口
    this.app.listen(port, () => {
      Logger.log(`Application is running on http://localhost:${port}`, 'NestApplication');
    });
  }
}
