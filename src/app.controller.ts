import { Get, Controller, Inject } from "./@nestjs/common";
import { LoggerService, UseClassService, UseFactoryService, UseValueService } from "./logger.service";
@Controller()
export class AppController {
  constructor(private loggerService: LoggerService, @Inject("UseValueService") private useValueService: UseValueService, @Inject("UseFactoryService") private useFactoryService: UseFactoryService, @Inject("UseClassService") private useClassService: UseClassService) { }
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
    this.useFactoryService.log("app controller useFactoryService log")
    this.useClassService.log("app controller useClassService log")
    return 'Hello Nest!';
  }
}
