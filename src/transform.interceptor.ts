import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next): Observable<Response<T>> {
    return next.handle().pipe(map(data => {
      console.log('TransformInterceptor', data);
      return ({ data });
    }));
  }
}
