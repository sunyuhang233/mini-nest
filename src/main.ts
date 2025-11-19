import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


async function bootstrap() {
  // 创建一个 NestApplication 实例
  const app = await NestFactory.create(AppModule)
  // 启动应用程序并监听端口 3000
  await app.listen(3000);
}

bootstrap();
