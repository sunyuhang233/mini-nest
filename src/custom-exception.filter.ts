import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "./@nestjs/common";
import { Response, Request } from "express"
@Catch(BadRequestException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.getResponse()?.message || exception.getResponse(),
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      method: request.method,
    })
  }
}
