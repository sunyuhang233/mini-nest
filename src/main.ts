import { NestFactory } from "./@nestjs/core";
import { AppModule } from "./app.module";
import session from 'express-session';
/**
 * 启动
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(session({
    // 用于加密的秘钥
    secret: 'keyboard cat',
    // 在每次请求结束后是否强制保存会话 即使它并没有变化
    resave: false,
    // 是否保存未初始化的会话
    saveUninitialized: false,
    // cookie的配置 设置过期时间
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  }))
  await app.listen(3000)
}

bootstrap()
