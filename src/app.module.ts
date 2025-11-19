import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Logging6Interceptor } from "./logger6.interceptor";
import { Logging5Interceptor } from "./logger5.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
@Module({
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: Logging6Interceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: Logging5Interceptor,
    }
  ],
  controllers: [AppController],
})
export class AppModule { }
