import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { Roles } from "./role.decorator";
@Controller("account")
export class AccountController {
  @Get()
  @UseGuards(AuthGuard)
  @Roles("admin")
  index() {
    return "account index";
  }
}
