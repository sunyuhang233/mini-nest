import { APP_PIPE } from "@nestjs/core";
import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CustomPipe } from './custom.pip'
@Module({
  providers: [
    {
      provide: "PROVIDE",
      useValue: "PROVIDE_VALUE",
    },
    {
      provide: APP_PIPE,
      useClass: CustomPipe,
    },
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule { }
