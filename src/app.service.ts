import { Inject } from "@nestjs/common";

export class AppService {
  constructor(@Inject("PROVIDE") private provideValue: string) { }
  getHello(): string {
    return 'Hello World!' + this.provideValue;
  }
}
