import { Logger, NestApplication } from ".";

export class NestFactory {
  static async create(module: any) {
    // 打印启动日志
    Logger.log('Starting Nest application...', 'NestFactory');
    // 创建实例
    const app = new NestApplication(module);
    return app
  }
}
