import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {

  getHello(): string {
    console.log('LoggerService');
    return 'Hello World!';
  }
}
