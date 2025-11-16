import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from 'express-session'
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  // 创建一个 NestApplication 实例
  const app = await NestFactory.create(AppModule)
  // 全局管道
  app.useGlobalPipes(new ValidationPipe())
  await app.use(session({
    secret: "your_secret_key", //加密会话的密钥
    resave: false, // 强制会话在每次请求结束后是否都强制重新保存会话，即使会话没有被修改
    saveUninitialized: false, // 强制将未初始化的会话保存到存储中
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 会话cookie的过期时间，单位为毫秒
    },
  }))
  // 启动应用程序并监听端口 3000
  await app.listen(3000);
}

bootstrap();
