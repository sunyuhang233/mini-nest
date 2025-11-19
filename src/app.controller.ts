import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { Logger1Interceptor } from "./logger1.interceptor";
import { Logger2Interceptor } from "./logger2.interceptor";
import { Logging3Interceptor } from "./logger3.interceptor";
import { Logging4Interceptor } from "./logger4.interceptor";
@Controller("app")
@UseInterceptors(Logging3Interceptor)
@UseInterceptors(Logging4Interceptor)
export class AppController {
  constructor(private appService: AppService) { }
  @Get()
  @UseInterceptors(Logger1Interceptor)
  @UseInterceptors(Logger2Interceptor)
  getHello(): string {
    return 'hello world';
  }
}
