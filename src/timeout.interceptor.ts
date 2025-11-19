import { Injectable, NestInterceptor, ExecutionContext, RequestTimeoutException, CallHandler, } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(1000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          console.log('timeout...');
          return throwError(() => {
            return new RequestTimeoutException();
          });
        } else {
          return throwError(() => err);
        }
      }),
    );
  }
}
