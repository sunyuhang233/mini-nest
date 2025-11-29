import { Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "./app.service";
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }
  // 带时间戳  { timestamp: true }
  private readonly logger = new Logger(AppController.name);
  @Get()
  getHello(): string {
    this.logger.error("getHello error");
    return this.appService.getHello();
  }
}
