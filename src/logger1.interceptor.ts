import { CallHandler } from "@nestjs/common";
import { ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class Logger1Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("before1....");
    const now = Date.now();
    return next.handle().pipe(tap(() => {
      console.log(`after1....${Date.now() - now}ms`);
    }));
  }
}
