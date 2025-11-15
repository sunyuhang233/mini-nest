import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { ExceptionController } from "./exception.controller";
import { APP_FILTER } from './@nestjs/core'
import { CustomExceptionFilter } from "./custom-exception.filter";
@Module({
  providers: [
    {
      provide: "PROVIDE",
      useValue: "PROVIDE_VALUE",
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    }
  ],
  controllers: [AppController, ExceptionController],
})
export class AppModule { }
