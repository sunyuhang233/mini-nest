import { Get, Controller, Req, Request, Query, Headers, Session, Ip, Param } from "@nestjs/common";
import type { Request as ExpressRequest } from 'express';
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
}

