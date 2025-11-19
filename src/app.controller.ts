import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { Logger1Interceptor } from "./logger1.interceptor";
import { Logger2Interceptor } from "./logger2.interceptor";
import { Logging3Interceptor } from "./logger3.interceptor";
import { Logging4Interceptor } from "./logger4.interceptor";
import { CacheInterceptor } from './cache.interceptor';
import { TimeoutInterceptor } from './timeout.interceptor';
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

  @Get('cache')
  @UseInterceptors(CacheInterceptor)
  async cache() {
    console.log('cache...');
    return 'cache';
  }

  @Get('timeout')
  @UseInterceptors(TimeoutInterceptor)
  async timeout() {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
