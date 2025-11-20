import { Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor } from "@nestjs/platform-express";
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }
  @Get()
  getHello(): string {
    return 'hello world';
  }
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { message: 'File uploaded successfully' };
  }
}
