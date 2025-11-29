import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerModule } from "./logger.module";

@Module({
  providers: [
    AppService,
  ],
  controllers: [AppController],
  imports: [LoggerModule],
})
export class AppModule { }

