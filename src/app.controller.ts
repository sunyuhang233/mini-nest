import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Inject } from "@nestjs/common";
import { LoggerService } from "./logger.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject('LoggerService') private readonly loggerService: LoggerService
  ) { }

  @Get()
  get() {
    return 'aaa'
  }

  @Get('request')
  getHello() {
    const a = this.appService.save({ username: 'admin', password: '123456' })
    this.loggerService.getHello()
    return a
  }
}
