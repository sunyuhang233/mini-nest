import { Get, Controller } from "./@nestjs/common";
@Controller()
export class AppController {
  @Get()
  index() {
    return 'Hello World Nest!';
  }
  @Get('hello')
  hello() {
    return 'Hello Nest!';
  }
}
