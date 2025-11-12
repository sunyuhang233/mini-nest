import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DynamicConfigModule } from "./dynamicConfig.module";

@Module({
  imports: [DynamicConfigModule.forRoot('1000abc')],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule { }
