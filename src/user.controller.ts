import { Get, Controller, Req, Request, Query, Headers, Session, Ip, Param, Post, Body, Res, Response } from "@nestjs/common";
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
@Controller('user')
export class UserController {
  @Get('req')
  handleReq(@Req() req: ExpressRequest, age: string, @Request() request: ExpressRequest) {
    console.log(age)
    console.log(req.method)
    console.log(req.url)
    console.log(req.path)
    console.log(request.method)
    console.log(request.url)
    console.log(request.path)
    return 'User Nest!';
  }
  @Get('query')
  handleQuery(@Query() query, @Query('id') id: string) {
    console.log(query)
    console.log(id)
    return 'User Nest!';
  }
  @Get('headers')
  handleHeaders(@Headers() headers: Record<string, string>, @Headers('host') host: string) {
    console.log(headers)
    console.log(host)
    return 'User Nest!';
  }
  @Get('session')
  handleSession(@Session() session: Record<string, any>, @Session("pageView") pageView: number) {
    console.log(session)
    if (!pageView) {
      session.pageView = 0
    }
    session.pageView++
    return 'User Nest! ' + session.pageView;
  }
  @Get('ip')
  handleIp(@Ip() ip: string) {
    console.log(ip)
    return 'User Nest! ' + ip;
  }
  @Get(":id/info/:name")
  handleId(@Param("id") id: string, @Param("name") name: string, @Param() params: Record<string, string>) {
    console.log(id)
    console.log(name)
    console.log(params)
    return 'User Nest! ' + id + name;
  }
  @Get("star/ab*de")
  handleStar() {
    return 'User Nest! '
  }
  @Post("login")
  handleLogin(@Body() body: Record<string, any>, @Body("username") username: string, @Body("password") password: string) {
    console.log(body)
    console.log(username)
    console.log(password)
    return 'User Nest! '
  }
  @Post("register")
  handleRegister(@Body() body: Record<string, any>, @Res() res: ExpressResponse) {
    console.log(body)
    return 'aa'
  }
  @Get("passthrough")
  handlePassthrough(@Response({ passthrough: true }) res: ExpressResponse) {
    // 有的时候 我们只想添加一些响应头 而不是返回一个响应体
    res.setHeader('key', 'value')
    return 'aabb'
  }
}

