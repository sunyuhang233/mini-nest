import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { Roles } from "./role.decorator";
import { Roles2 } from "./role2.decorator";
import { Auth2Guard } from "./auth2.guard";
@Controller("account")
export class AccountController {
  @Get()
  @UseGuards(Auth2Guard)
  // @Roles("admin")
  @Roles2(['admin'])
  index() {
    return "account index";
  }
}
