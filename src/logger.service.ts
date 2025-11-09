import { Inject, Injectable } from "./@nestjs/common";

@Injectable()
export class LoggerService {
  constructor(@Inject("SUFFIX") private suffix: string) {
    console.log('LoggerService constructor', this.suffix)
  }
  log(msg: string) {
    console.log('LoggerService:', msg, this.suffix)
  }
}

@Injectable()
export class UseValueService {
  constructor(private value: string) { }
  log(msg: string) {
    console.log('UseValueService:', msg, "this value is ", this.value)
  }
}

@Injectable()
export class UseFactoryService {
  constructor(private name: string, private age: number) { }
  log(msg: string) {
    console.log('UseFactoryService:', msg, "my name is ", this.name, "my age is ", this.age)
  }
}

@Injectable()
export class UseClassService {
  log(msg: string) {
    console.log('UseClassService:', msg)
  }
}
