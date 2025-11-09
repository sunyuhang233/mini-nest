import { Get, Controller, Inject } from "./@nestjs/common";
import { LoggerService, UseValueService } from "./logger.service";
@Controller()
export class AppController {
  constructor(private loggerService: LoggerService, @Inject("UseValueService") private useValueService: UseValueService) { }
  @Get()
  index() {
    return 'Hello World Nest!';
  }
  @Get('hello')
  hello() {
    return 'Hello Nest!';
  }
  @Get("log")
  log() {
    this.loggerService.log("app controller log")
    this.useValueService.log("app controller useValueService log")
    return 'Hello Nest!';
  }
}
