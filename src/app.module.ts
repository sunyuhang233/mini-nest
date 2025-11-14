import { Module, MiddlewareConsumer, NestModule, RequestMethod } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DynamicConfigModule } from "./dynamicConfig.module";
import { LoggerMiddleware } from "./logger.middleware";

@Module({
  imports: [DynamicConfigModule.forRoot('1000abc')],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      //.forRoutes({ path: '/helloWorld', method: RequestMethod.GET })
      // 路由通配符
      //.forRoutes("ab*de")
      .forRoutes(AppController)
      .exclude(
        { path: '/app/abcde', method: RequestMethod.GET },
      )

  }
}
