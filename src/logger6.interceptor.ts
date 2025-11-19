import { ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators'
export class Logging6Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    console.log('Before6...')
    const now = Date.now();
    return next.handle().pipe(tap(() => {
      console.log(`After6... ${Date.now() - now}ms`)
    }));
  }
}
