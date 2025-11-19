import { ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators'
export class Logging3Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next): Observable<any> {
    console.log('Before3...')
    const now = Date.now();
    return next.handle().pipe(tap(() => {
      console.log(`After3... ${Date.now() - now}ms`)
    }));
  }
}
