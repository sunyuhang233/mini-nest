import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import multer from 'multer';
import { Request, Response } from 'express';

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
