import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import multer from 'multer';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

export function FileInterceptor(fileName: string) {
  @Injectable()
  class FileInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = multer()
      await new Promise((resolve, reject) => {
        upload.single(fileName)(request, response, (err) => (err ? reject(err) : resolve(undefined)));
      });
      return next.handle();
    }
  }
  return new FileInterceptor();
}


export function FilesInterceptor(fieldName: string, maxCount?: number) {
  @Injectable()
  class FilesInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = multer()
      await new Promise((resolve, reject) => {
        upload.array(fieldName, maxCount)(request, response, (err) => (err ? reject(err) : resolve(undefined)));
      });
      return next.handle();
    }
  }
  return new FilesInterceptor();
}


export function FileFieldsInterceptor(uploadFields: { name: string, maxCount?: number }[]) {
  @Injectable()
  class FileFieldsInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = multer()
      await new Promise((resolve, reject) => {
        upload.fields(uploadFields)(request, response, (err) => (err ? reject(err) : resolve(undefined)));
      });
      return next.handle();
    }
  }
  return new FileFieldsInterceptor();
}


export function AnyFilesInterceptor() {
  @Injectable()
  class AnyFilesInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = multer()
      await new Promise((resolve, reject) => {
        upload.any()(request, response, (err) => (err ? reject(err) : resolve(undefined)));
      });
      return next.handle();
    }
  }
  return new AnyFilesInterceptor();
}


@Injectable()
export class NoFilesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.files && request.files.length as number > 0) {
      throw new BadRequestException('Files are not allowed');
    }
    return next.handle();
  }
}
