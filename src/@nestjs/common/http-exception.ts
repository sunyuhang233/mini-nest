import { HttpStatus } from "./http-status.enum";

export class HttpException extends Error {
  response: string | object;
  status: HttpStatus;
  constructor(response: string | object, status: HttpStatus) {
    super()
    this.response = response;
    this.status = status;
  }
  getResponse() {
    return this.response;
  }
  getStatus() {
    return this.status;
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string, error?: any) {
    super({ message, error: error ?? "Bad Request", statusCode: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST)
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string, error?: any) {
    super({
      status: HttpStatus.FORBIDDEN,
      message,
      error,
    }, HttpStatus.FORBIDDEN)
  }
}

export class BadGatewayException extends HttpException {
  constructor(message: string, error?: any) {
    super({
      status: HttpStatus.BAD_GATEWAY,
      message,
      error,
    }, HttpStatus.BAD_GATEWAY)
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(message?: string, error?: any) {
    super({ message: message ?? "Request Timeout", error, statusCode: HttpStatus.REQUEST_TIMEOUT }, HttpStatus.REQUEST_TIMEOUT)
  }
}
