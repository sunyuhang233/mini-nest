import { ExecutionContext } from "./execution-context.interface";

export interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next)
}
