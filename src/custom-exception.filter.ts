import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Inject } from "./@nestjs/common";
import { Response, Request } from "express"
@Catch(BadRequestException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(@Inject("PROVIDE") private provideValue: string) {

  }
  catch(exception: any, host: ArgumentsHost): void {
    console.log(this.provideValue, '自定义异常过滤器')
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
