import { Logger } from './logger';
import { NestApplication } from './nest-application';
export class NestFactory {
  static async create<T>(module: T): Promise<NestApplication<T>> {
    Logger.log('Starting Nest application...', 'NestFactory');
    // 创建一个 NestApplication 实例
    const app = new NestApplication<T>(module);
    return app;
  }
}
