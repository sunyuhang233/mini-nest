import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { ExceptionController } from "./exception.controller";

@Module({
  controllers: [AppController, ExceptionController],
})
export class AppModule { }
