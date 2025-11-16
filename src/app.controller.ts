import { Get, Controller } from "./@nestjs/common";
import { AppService } from "./app.service";
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }

  @Get("test")
  abcde() {
    return this.appService.getHello()
  }
}
