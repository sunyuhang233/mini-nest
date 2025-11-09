import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { LoggerService, UseClassService, UseFactoryService, UseValueService } from "./logger.service";
import { UserController } from "./user.controller";

@Module({
  controllers: [AppController, UserController],
  providers: [
    {
      provide: "SUFFIX",
      useValue: "suffix"
    },
    LoggerService, // 这样写 token就是类本身 本质等价于 {provide: LoggerService, useClass: LoggerService}
    {
      provide: "UseValueService", // Token 也被称为标志 令牌 也就是privide的名字
      useValue: new UseValueService("custom useValueService") // 提供一个值
    },
    {
      provide: "UseFactoryService",
      inject: ["name", "SUFFIX"],
      useFactory: (name: string, suffix: string) => new UseFactoryService(name, suffix)
    },
    {
      provide: "UseClassService",
      useClass: UseClassService
    },
  ],
})
export class AppModule { }
