import { Body, Controller, Get, UseFilters } from "@nestjs/common";
import { AppService } from "./app.service";
import { isPublic } from "./public.metadata";
import { I18n, I18nContext, I18nValidationExceptionFilter } from "nestjs-i18n";
import { I18nTranslations } from "./generated/i18n.generated";
import { Post } from "./@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }
  @Get()
  @isPublic()
  async getHello(@I18n() i18n: I18nContext<I18nTranslations>): Promise<string> {
    return await i18n.t('test.HELLO');
  }

  @Get("args")
  @isPublic()
  async getProduct(@I18n() i18n: I18nContext<I18nTranslations>): Promise<string> {
    return await i18n.t('test.PRODUCT.NEW', { args: { name: 'NestJS' } });
  }

  @Post("create-user")
  @isPublic()
  createUser(@Body() createUserDto: CreateUserDto): string {
    return 'create user'
  }

}
