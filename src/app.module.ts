import { Module } from "./@nestjs/common";
import { AccountController } from "./account.controller";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
@Module({
  providers: [
    AppService,
  ],
  controllers: [AppController, AccountController],
})
export class AppModule { }
