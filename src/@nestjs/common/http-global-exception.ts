import { ArgumentsHost } from "./argument-host.interface";
import { ExceptionFilter } from "./exception-filter.interface";
import { HttpException } from "./http-exception";
import { Response } from "express";
import { HttpStatus } from "./http-status.enum";
/**
 * 过滤器处理类型为HttpException（及其子类）的异常
 * 当异常是未识别的（即不是 httpexception 也不是继承自 httpexception的类）
 * 内置的异常过滤器会生成默认的json响应 {statusCode: 500, message: "Internal server error"}
 */
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // 如果响应头已经发送，直接返回
    if (response.headersSent) return
    if (exception instanceof HttpException) {
      // 处理 HttpException 异常
      const res = exception.getResponse();
      const statusCode = exception.getStatus();
      if (typeof res === 'string') {
        response.status(statusCode).json({
          statusCode,
          message: res,
        })
      } else {
        response.status(statusCode).json(res);
      }
    } else {
      response.status(500).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: exception.message,
        message: "Internal server error",
      });
    }
  }
}
