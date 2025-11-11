import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { LoggerModule } from "./logger.module";
import { LoggerService, UseClassService, UseFactoryService, UseValueService } from "./logger.service";
import { UserController } from "./user.controller";

@Module({
  imports: [LoggerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
