import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { LoggerService } from "./logger.service";
@Module({
  controllers: [AppController],
  providers: [AppService,
    // 这也是一种定义providers的方式
    {
      provide: 'LoggerService', // 定义一个别名
      useValue: new LoggerService() // 使用LoggerService
    }],
})
export class AppModule { }
