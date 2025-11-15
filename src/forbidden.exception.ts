import { HttpException, HttpStatus } from "@nestjs/common";
/**
 * 自定义异常：403 Forbidden
 */
export class ForbiddenException extends HttpException {
  constructor() {
    super("Forbidden", HttpStatus.FORBIDDEN)
  }
}
