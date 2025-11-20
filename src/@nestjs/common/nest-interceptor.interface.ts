import { Observable } from "rxjs";
import { CallHandler } from "./call-handler.interface";
import { ExecutionContext } from "./execution-context.interface";

export interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<R>;
}
