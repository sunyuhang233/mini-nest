import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logging6Interceptor } from "./logger6.interceptor";
import { Logging5Interceptor } from "./logger5.interceptor";

async function bootstrap() {
  // 创建一个 NestApplication 实例
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new Logging6Interceptor());
  app.useGlobalInterceptors(new Logging5Interceptor());
  // 启动应用程序并监听端口 3000
  await app.listen(3000);
}

bootstrap();
