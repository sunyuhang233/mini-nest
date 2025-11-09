import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { LoggerService, UseValueService } from "./logger.service";
import { UserController } from "./user.controller";

@Module({
  controllers: [AppController, UserController],
  providers: [
    LoggerService,
    {
      provide: "UseValueService", // Token 也被称为标志 令牌 也就是privide的名字
      useValue: new UseValueService() // 提供一个值
    }
  ],
})
export class AppModule { }
