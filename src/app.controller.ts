import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { Logger1Interceptor } from "./logger1.interceptor";
import { Logger2Interceptor } from "./logger2.interceptor";
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }
  @Get()
  @UseInterceptors(Logger1Interceptor)
  @UseInterceptors(Logger2Interceptor)
  getHello(): string {
    return 'hello world';
  }
}
