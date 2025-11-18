import { CallHandler } from "@nestjs/common";
import { ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class Logger2Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("before2....");
    const now = Date.now();
    return next.handle().pipe(tap(() => {
      console.log(`after2....${Date.now() - now}ms`);
    }));
  }
}
