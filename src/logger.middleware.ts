import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import { AppService } from "./app.service"

@Injectable() // 如果有依赖注入 ，则必须添加 @Injectable() 装饰器 如果没有依赖注入 ，则可以不添加
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly appService: AppService) { }
  use(req: Request, res: Response, next: NextFunction): void {
    console.log('LoggerMiddleware...', this.appService.getHello())
    next()
  }
}
