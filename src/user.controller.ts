import { Controller, Get, Request, Req, Session, Ip, Param, Post, Body, Response, Res, Next, Redirect, HttpCode, Header } from './@nestjs/common';
// 从 'express' 模块导入 Request 类型并重命名为 ExpressRequest
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { User } from './user.decorators';
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

  @Get('session')
  handleSession(@Session() session: any, @Session('pageViews') pageViews: string): string {
    console.log(session);
    console.log(pageViews);
    if (!session.pageViews) {
      session.pageViews = 1;
    } else {
      session.pageViews++;
    }
    return `You visited this page ${session.pageViews} times`;
  }

  @Get('ip')
  handleIp(@Ip() ip: string): string {
    return `The IP address of the user is: ${ip}`;
  }
  @Get(':username/info/:age')
  handleInfo(@Param() params: any, @Param('username') username: string, @Param('age') age: number): string {
    console.log(params);
    return `Hello, ${username}! You are ${age} years old.`;
  }

  @Get('ab*de')
  handleWildcardRoute() {
    return 'This route uses a wildcard';
  }

  @Post('create')
  handleCreate(@Body() body: any, @Body("username") username: string): string {
    console.log(body);
    console.log(username);
    return 'User created';
  }

  @Get('res')
  handleResponse(@Res() res: ExpressResponse, @Response() response: ExpressResponse): void {
    res.send('Custom response');
  }

  @Get('passthrough')
  passthrough(@Res({ passthrough: true }) res: ExpressResponse): string {
    return 'Custom response';
  }

  @Get('next')
  handleNext(@Next() next) {
    console.log('next');
    next();
  }

  @Get('redirect')
  @Redirect('/users/req', 302)
  handleRedirect(): void { }

  @Get('redirect2')
  handleRedirect2() {
    return { url: 'https://www.baidu.com', statusCode: 301 };
  }

  @Get("code")
  @HttpCode(200)
  handleCode() {
    return "404 233";
  }

  @Get("header")
  @Header("key1", "value1")
  @Header("key2", "value2")
  handleHeader() {
    return "Hello World";
  }

  @Get("customer")
  customer(@User() user: any, @User("username") username: string) {
    console.log(user);
    return username;
  }
}
