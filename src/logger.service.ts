import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {
  log(msg: string) {
    console.log('LoggerService:', msg)
  }
}

@Injectable()
export class UseValueService {
  log(msg: string) {
    console.log('UseValueService:', msg)
  }
}
