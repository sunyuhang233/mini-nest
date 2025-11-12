import { Inject } from "@nestjs/common";

export class AppService {
  constructor(@Inject("CONFIG") private readonly config: any, @Inject("Token") private readonly token: string) { }
  getHello(): string {
    console.log(this.config)
    console.log(this.token)
    return 'Hello World!' + this.config.apiKey + this.token;
  }
}
