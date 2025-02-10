// 从 '@nestjs/common' 模块导入 Controller、Get、Request 和 Req 装饰器
import { Controller, Get, Request, Req } from './@nestjs/common';
// 从 'express' 模块导入 Request 类型并重命名为 ExpressRequest
import { Request as ExpressRequest } from 'express';
// 使用 @Controller 装饰器定义 'users' 路由
@Controller('users')
export class UserController {
  @Get('req')
  // 处理请求的函数，使用 @Request 和 @Req 装饰器注入 ExpressRequest 对象
  handleRequest(@Request() request: ExpressRequest, @Req() req: ExpressRequest): string {
    // 返回一个字符串，表示请求已处理
    console.log(req.url);
    console.log(request.url);
    return 'Request handled';
  }
}
