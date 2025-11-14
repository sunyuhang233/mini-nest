import { Get, Controller } from "./@nestjs/common";
import { AppService } from "./app.service";
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }
  // @Get()
  // index() {
  //   return 'Hello World Nest!';
  // }
  // @Get('hello')
  // hello() {
  //   return 'Hello Nest!';
  // }
  // @Get("log")
  // log() {
  //   this.otherService.log("app controller otherService log")
  //   return 'Hello Nest!';
  // }
  @Get("helloWorld")
  helloWorld() {
    console.log("app controller helloWorld")
    return this.appService.getHello();
  }

  @Get("abcde")
  abcde() {
    return "abcde"
  }
}
