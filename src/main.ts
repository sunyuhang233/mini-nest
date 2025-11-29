import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConsoleLogger } from "@nestjs/common";
import { MyLogger } from "./loggerService";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 禁用日志
    //logger: false
    // 打印指定类型的日志
    //logger: ['log', 'error', 'warn'],
    // 打印 JSON 格式的日志
    // logger: new ConsoleLogger({
    //   json: true,
    // })
    // 自己实现
    //logger: console
    //logger: new MyLogger(),
    // 缓冲日志
    bufferLogs: true,
  })
  // 使用自定义日志器
  app.useLogger(app.get(MyLogger));
  await app.listen(3000);
}

bootstrap();
