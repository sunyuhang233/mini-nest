// 引入 express 及其相关类型
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
// 引入 path 模块
import path from 'path';
// 引入 Logger 类
import { Logger } from './logger';
import { DESIGN_PARAMTYPES, INJECTED_TOKENS } from '@nestjs/common/constants';
import { AppService } from 'src/app.service';
import { LoggerService } from 'src/logger.service';
// 定义 NestApplication 类
class NestApplication {
  // 定义私有的 express 实例
  private readonly app: Express = express();
  // 定义私有的模块属性
  private readonly module: any;
  // 构造函数，接收一个模块作为参数
  constructor(module: any) {
    this.module = module;
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((req: any, res, next) => {
      req.user = { username: "admin", password: "123456" }
      next()
    })
  }
  // 使用中间件的方法
  use(middleware: (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void) {
    this.app.use(middleware);
  }
  // 初始化方法
  async init() {
    // 获取模块中定义的控制器
    const controllers = Reflect.getMetadata('controllers', this.module) || [];
    // 记录初始化日志
    Logger.log('AppModule dependencies initialized', 'InstanceLoader');
    // 遍历所有控制器
    for (const Controller of controllers) {
      // 获取控制器的依赖
      const dependencies = this.resolveDependencies(Controller);
      // 创建控制器实例
      const controller = new Controller(...dependencies);
      // 获取控制器的前缀
      const prefix = Reflect.getMetadata('prefix', Controller) || '/';
      // 获取控制器的原型
      const controllerPrototype = Reflect.getPrototypeOf(controller);
      // 记录路由解析日志
      Logger.log(`${Controller.name} {${prefix}}:`, 'RoutesResolver');
      // 遍历控制器的方法
      for (const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
        const method = controllerPrototype[methodName];
        // 获取方法的路径元数据
        const pathMetadata = Reflect.getMetadata('path', method);
        // 获取方法的 HTTP 方法元数据
        const httpMethod = Reflect.getMetadata('method', method);
        // 获取重定向地址
        const redirectUrl = Reflect.getMetadata('redirectUrl', method);
        // 获取状态码
        const redirectStatusCode = Reflect.getMetadata('redirectStatusCode', method);
        const statusCode = Reflect.getMetadata('statusCode', method);
        // 获取是否自定义了headers
        const headers = Reflect.getMetadata('headers', method) || [];
        // 如果定义了 HTTP 方法
        if (httpMethod) {
          // 生成路由路径
          const routPath = path.posix.join('/', prefix, pathMetadata);
          // 定义路由
          this.app[httpMethod.toLowerCase()](routPath, async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            // 解析方法参数
            const args = this.resolveParams(controller, methodName, req, res, next);
            // 调用方法并获取结果 
            const result = await method.call(controller, ...args);
            // 判断是否是在函数运行结果里面定义了重定向
            if (result?.url) return res.redirect(result.statusCode || 302, result.url);
            // 判断是否需要重定向
            if (redirectUrl) return res.redirect(redirectStatusCode || 302, redirectUrl);
            // 判断状态码
            if (statusCode) {
              res.statusCode = statusCode
            } else if (httpMethod === 'POST') {
              res.statusCode = 201
            }

            // 发送响应结果
            const responseMeta = this.getResponseMetadata(controller, methodName);
            if (!responseMeta || (responseMeta.data?.passthrough)) {
              headers.forEach((header: { name: string, value: string }) => {
                res.setHeader(header.name, header.value);
              })
              return res.send(result);
            }
          });
          // 记录路由映射日志
          Logger.log(`Mapped {${routPath}, ${httpMethod}} route`, 'RouterExplorer');
        }
      }
    }
    // 记录应用启动成功日志
    Logger.log('Nest application successfully started', 'NestApplication');
  }
  // 解析控制器依赖
  private resolveDependencies(controller: any) {
    const injectTokens = Reflect.getMetadata(INJECTED_TOKENS, controller) || []
    const constructor = Reflect.getMetadata(DESIGN_PARAMTYPES, controller) || []
    return constructor.map((param: any, index: number) => {
      if (index === 0) return new AppService()
      else if (index === 1) return new LoggerService()
    })
  }
  // 获取响应元数据
  private getResponseMetadata(controller: any, methodName: string) {
    const paramsMetadata = Reflect.getMetadata(`params`, controller, methodName) || [];
    return paramsMetadata.filter(Boolean).find((param: any) => param.key === 'Response' || param.key === 'Res' || param.key === 'Next');
  }
  // 解析方法参数
  private resolveParams(instance: any, methodName: string, req: ExpressRequest, res: ExpressResponse, next: Function): any[] {
    // 获取参数元数据
    const paramsMetadata = Reflect.getMetadata(`params`, instance, methodName) || [];
    // 根据参数的索引排序并返回参数数组
    return paramsMetadata.map((param: any) => {
      const { key, data, factory } = param;
      // 返回上下文
      const ctx = {
        switchToHttp() {
          return {
            getRequest: () => req,
            getResponse: () => res,
            getNext: () => next
          }
        }
      }
      switch (key) {
        case 'Request':
        case 'Req':
          return req;
        case 'Query':
          return data ? req.query[data] : req.query;
        case 'Headers':
          return data ? req.headers[data] : req.headers;
        case 'Session':
          return data ? req.session[data] : req.session;
        case 'Ip':
          return req.ip;
        case 'Param':
          return data ? req.params[data] : req.params;
        case 'Response':
        case 'Res':
          return res;
        case 'Body':
          return data ? req.body[data] : req.body;
        case 'Next':
          return next;
        case 'DecoratorFactory':
          return factory(data, ctx);
        default:
          return null;
      }
    });
  }
  // 启动监听方法
  async listen(port: number) {
    // 初始化应用
    await this.init();
    // 启动监听指定端口
    this.app.listen(port, () => {
      // 记录应用运行日志
      Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
    });
  }
}
// 导出 NestApplication 类
export { NestApplication };
