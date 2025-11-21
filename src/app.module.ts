import { Module } from "./@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MulterModule } from '@nestjs/platform-express';
@Module({
  providers: [
    AppService,
  ],
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
})
export class AppModule { }
