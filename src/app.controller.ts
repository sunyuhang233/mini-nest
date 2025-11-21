import { Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor, NoFilesInterceptor } from "@nestjs/platform-express";
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

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return { message: 'Files uploaded successfully' };
  }

  @Post('fileFields')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 },
  ]))
  fileFields(@UploadedFiles() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] }) {
    console.log(files);
    return { message: 'successfully' };
  }

  @Post('anyFiles')
  @UseInterceptors(AnyFilesInterceptor())
  anyFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return { message: 'anyFiles uploaded successfully' };
  }

  @Post('noFiles')
  @UseInterceptors(NoFilesInterceptor)
  @UseInterceptors(AnyFilesInterceptor())
  noFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return { message: 'noFiles uploaded successfully' };
  }
}
