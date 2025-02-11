// 引入 express 及其相关类型
import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
// 引入 path 模块
import path from 'path';
// 引入 Logger 类
import { Logger } from './logger';
// 定义 NestApplication 类
class NestApplication {
  // 定义私有的 express 实例
  private readonly app: Express = express();
  // 定义私有的模块属性
  private readonly module: any;
  // 构造函数，接收一个模块作为参数
  constructor(module: any) {
    this.module = module;
  }
  // 使用中间件的方法
  use(middleware: (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void) {
    console.log('middleware');
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
      // 创建控制器实例
      const controller = new Controller();
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
            // 发送响应结果
            res.send(result);
          });
          // 记录路由映射日志
          Logger.log(`Mapped {${routPath}, ${httpMethod}} route`, 'RouterExplorer');
        }
      }
    }
    // 记录应用启动成功日志
    Logger.log('Nest application successfully started', 'NestApplication');
  }
  // 解析方法参数
  private resolveParams(instance: any, methodName: string, req: ExpressRequest, res: ExpressResponse, next: Function): any[] {
    // 获取参数元数据
    const paramsMetadata = Reflect.getMetadata(`params`, instance, methodName) || [];
    // 根据参数的索引排序并返回参数数组
    return paramsMetadata.map((param: any) => {
      const { key, data } = param;
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
