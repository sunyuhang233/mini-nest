import { Get, Controller, Req, Request } from "@nestjs/common";
import type { Request as ExpressRequest } from 'express';
@Controller('user')
export class UserController {
  @Get('req')
  handleReq(@Req() req: ExpressRequest, @Request() request: ExpressRequest) {
    console.log(req.method)
    console.log(req.url)
    console.log(req.path)
    console.log(request.method)
    console.log(request.url)
    console.log(request.path)
    return 'User Nest!';
  }
}
