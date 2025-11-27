import { APP_GUARD } from "@nestjs/core";
import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { AuthGuard } from "./auth.guard";
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import path from "path";
@Module({
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  controllers: [AppController],
  imports: [AuthModule, UsersModule, I18nModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
      path: path.join(__dirname, '/i18n/'),
      watch: true,
    },
    resolvers: [
      new QueryResolver(["lang", "l"]),
      new HeaderResolver(["x-custom-lang"]),
      new CookieResolver(),
      AcceptLanguageResolver,
    ],
    typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
  }),],
})
export class AppModule { }
