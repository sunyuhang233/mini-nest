import { Get, Controller, Inject } from "./@nestjs/common";
import { LoggerService, UseClassService, UseFactoryService, UseValueService } from "./logger.service";
import { OtherService } from "./other.service";
@Controller()
export class AppController {
  constructor(private otherService: OtherService) { }
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
    this.otherService.log("app controller otherService log")
    return 'Hello Nest!';
  }
}
