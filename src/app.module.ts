import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { LoggerModule } from "./logger.module";
import { OtherModule } from "./other.module";

@Module({
  imports: [LoggerModule, OtherModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
