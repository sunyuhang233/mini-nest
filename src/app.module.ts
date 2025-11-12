import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DynamicConfigModule } from "./dynamicConfig.module";

@Module({
  imports: [DynamicConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule { }
