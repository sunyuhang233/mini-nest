import { Inject, Injectable } from "./@nestjs/common";
import { LoggerService } from "./logger.service";

@Injectable()
export class OtherService {
  constructor(private loggerService: LoggerService) {

  }
  log(msg: string) {
    console.log('OtherService:', msg)
    this.loggerService.log('OtherService log')
  }
}
