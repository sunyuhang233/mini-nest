import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import multer from 'multer';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { MulterConfigService } from './multer-config.service';
export function FileInterceptor(fileName: string) {
  @Injectable()
  class FileInterceptor implements NestInterceptor {
    constructor(
      readonly multerConfigService: MulterConfigService
    ) { }
    async intercept(context: ExecutionContext, next) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = this.multerConfigService.getMulterInstance().single(fileName);
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => (err ? reject(err) : resolve()));
      });
      return next.handle();
    }
  }
  return FileInterceptor;
}

export function FilesInterceptor(fieldName: string, maxCount?: number) {
  @Injectable()
  class FilesInterceptor implements NestInterceptor {
    constructor(
      readonly multerConfigService: MulterConfigService
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = this.multerConfigService.getMulterInstance().array(fieldName, maxCount);
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => (err ? reject(err) : resolve()));
      });
      return next.handle();
    }
  }
  return FilesInterceptor;
}

export function FileFieldsInterceptor(uploadFields: { name: string; maxCount?: number }[]) {
  @Injectable()
  class FileFieldsInterceptor implements NestInterceptor {
    constructor(
      readonly multerConfigService: MulterConfigService
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = this.multerConfigService.getMulterInstance().fields(uploadFields);
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => (err ? reject(err) : resolve()));
      });
      return next.handle();
    }
  }
  return FileFieldsInterceptor;
}

export function AnyFilesInterceptor() {
  @Injectable()
  class AnyFilesInterceptor implements NestInterceptor {
    constructor(
      readonly multerConfigService: MulterConfigService
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = this.multerConfigService.getMulterInstance().any();
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => (err ? reject(err) : resolve()));
      });
      return next.handle();
    }
  }
  return AnyFilesInterceptor;
}
@Injectable()
export class NoFilesInterceptor implements NestInterceptor {
  constructor(
    readonly multerConfigService: MulterConfigService
  ) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.files && request.files.length as number > 0) {
      throw new BadRequestException('Files are not allowed');
    }
    return next.handle();
  }
}
