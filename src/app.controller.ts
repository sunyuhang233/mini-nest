import { Get, Controller, Param, ParseIntPipe } from "./@nestjs/common";
import { AppService } from "./app.service";
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }

  @Get(":id")
  abcde(@Param("id", ParseIntPipe) id: number) {
    return `find this by ${id} ${typeof id}`
  }
}
