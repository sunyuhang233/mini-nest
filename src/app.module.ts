import { APP_GUARD } from "@nestjs/core";
import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { AuthGuard } from "./auth.guard";
@Module({
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  controllers: [AppController],
  imports: [AuthModule, UsersModule],
})
export class AppModule { }
