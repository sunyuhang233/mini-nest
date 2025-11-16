import { Get, Controller, Param, ParseIntPipe, ParseFloatPipe, ParseBoolPipe, ParseArrayPipe, ParseUUIDPipe, ParseEnumPipe, DefaultValuePipe, Post, Body, ValidationPipe } from "@nestjs/common";
import { AppService } from "./app.service";
import { Query } from "@nestjs/common";
import { CustomPipe } from "./custom.pip";
import { CreateCatDto, createCatSchema } from "./create-cat.dto";
import { UsePipes } from "@nestjs/common/use-pipes.decorator";
import { ZodValidationPipe } from "./zod-validation.pipe";
import { CreateUserDto } from "./create-user.dto";
enum Roles {
  Admin = "admin",
  User = "user",
}
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }

  @Get("/number/:id")
  findNumber(@Param("id", ParseIntPipe) id: number) {
    return `find this by ${id} ${typeof id}`
  }
  @Get("/float/:id")
  findFloat(@Param("id", ParseFloatPipe) id: number) {
    return `find this by ${id} ${typeof id}`
  }
  @Get("/bool/:id")
  findBool(@Param("id", ParseBoolPipe) id: boolean) {
    return `find this by ${id} ${typeof id}`
  }
  @Get("/array/:values")
  findArray(@Param("values", new ParseArrayPipe({ items: String, separator: ',' })) values: string[]) {
    console.log(values)
    return `find this by ${values} ${typeof values}`
  }
  @Get("/uid/:id")
  findUid(@Param("id", ParseUUIDPipe) id: string) {
    console.log(id)
    return `find this by ${id} ${typeof id}`
  }
  @Get("/role/:role")
  findRole(@Param("role", new ParseEnumPipe(Roles)) role: string) {
    console.log(role)
    return `find this by ${role} ${typeof role}`
  }
  @Get("default")
  findDefault(@Query("username", new DefaultValuePipe('hang')) username: string) {
    console.log(username)
    return `find this by ${username} ${typeof username}`
  }
  @Get("custom")
  findCustom(@Query("username", CustomPipe) username: string) {
    console.log(username)
    return `find this by ${username} ${typeof username}`
  }
  @Post("create-cat")
  @UsePipes(new ZodValidationPipe(createCatSchema))
  createCat(@Body() createCatDto: CreateCatDto) {
    console.log(createCatDto)
    return `create this by ${JSON.stringify(createCatDto)}`
  }
  @Post("create-user")
  createUser(@Body() createUserDto: CreateUserDto) {
    return `create this by ${JSON.stringify(createUserDto)}`
  }
}
