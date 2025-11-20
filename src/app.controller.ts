import { Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileSizeValidationPipe } from "./pipes/file-size-validation.pipe";
@Controller("app")
export class AppController {
  constructor(private appService: AppService) { }
  @Get()
  getHello(): string {
    return 'hello world';
  }
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(FileSizeValidationPipe) file: Express.Multer.File) {
    console.log(file);
    return { message: 'File uploaded successfully' };
  }
  @Post('file-validator')
  @UseInterceptors(FileInterceptor('file')) fileValidator(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
    }),
  )
  file: Express.Multer.File) {
    console.log(file);
    return { message: 'fileValidator' };
  }
}
