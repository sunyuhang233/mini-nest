import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {

  save(user: { username: string, password: string }) {
    return user
  }
}
