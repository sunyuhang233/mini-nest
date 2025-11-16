import { ArgumentsHost } from "./argument-host.interface";

export interface ExecutionContext extends ArgumentsHost {
  // 获取当前处理的类
  getClass<T = any>(): T
  // 获取当前处理的方法
  getHandler(): Function
} 
