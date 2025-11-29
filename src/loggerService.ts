import { ConsoleLogger, Inject, Injectable, LoggerService, LogLevel } from "@nestjs/common";

@Injectable()
// 实现 LoggerService 接口
// export class MyLoggerService implements LoggerService {
//   log(message: any, ...optionalParams: any[]) {
//     console.log('log', message, ...optionalParams);
//   }
//   error(message: any, ...optionalParams: any[]) {
//     console.error('error', message, ...optionalParams);
//   }
//   warn(message: any, ...optionalParams: any[]) {
//     console.warn('warn', message, ...optionalParams);
//   }
//   debug?(message: any, ...optionalParams: any[]) {
//     console.debug(message, ...optionalParams);
//   }
//   verbose?(message: any, ...optionalParams: any[]) {
//     console.log(message, ...optionalParams);
//   }
//   fatal?(message: any, ...optionalParams: any[]) {
//     console.log(message, ...optionalParams);
//   }
//   setLogLevels?(levels: LogLevel[]) {
//     console.log(levels);
//   }
// }

// 扩展内置日志器
export class MyLogger extends ConsoleLogger {
  // 构造函数中注入 logger 字符串 依赖注入
  constructor(@Inject("logger") private readonly logger: string) {
    super();
  }
  error(message: any, stack?: string, context?: string) {
    console.log('error', this.logger);
    super.error(message, stack, context);
  }
}
