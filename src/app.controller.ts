import { Get, Controller, Inject } from "./@nestjs/common";
import { LoggerService, UseClassService, UseFactoryService, UseValueService } from "./logger.service";
@Controller()
export class AppController {
  constructor(private loggerService: LoggerService, @Inject("UseClassService") private useClassService: UseClassService, @Inject("UseFactoryService") private useFactoryService: UseFactoryService) { }
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
    this.useClassService.log("app controller useClassService log")
    this.useFactoryService.log("app controller useFactoryService log")
    return 'Hello Nest!';
  }
}
