import { BadRequestException, Controller, Get, HttpException, HttpStatus, RequestTimeoutException, UseFilters } from "@nestjs/common";
import { ForbiddenException } from "./forbidden.exception";
import { CustomExceptionFilter } from "./custom-exception.filter";

@Controller('/exception')
export class ExceptionController {
  @Get('/throw')
  throwError() {
    // 当异常是未识别的（即不是 httpexception 也不是继承自 httpexception的类）
    throw new Error("未识别的异常")
  }
  @Get('/httpException')
  httpException() {
    throw new HttpException("http 异常", HttpStatus.BAD_REQUEST)
    // throw new HttpException({
    //   status: HttpStatus.BAD_REQUEST,
    //   message: "http 异常",
    //   error: "Bad Request",
    // }, HttpStatus.BAD_REQUEST)
  }
  @Get('/forbidden')
  forbidden() {
    throw new ForbiddenException()
  }
  @Get('/custom')
  //@UseFilters(CustomExceptionFilter)
  custom() {
    throw new BadRequestException("自定义异常")
  }
  @Get("/timeout")
  timeout() {
    throw new RequestTimeoutException("请求超时")
  }
}
