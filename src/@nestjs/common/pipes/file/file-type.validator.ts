import { Injectable } from "@nestjs/common/injectable.decorator";
import { FileValidator } from "./file-validator.interface";
import { BadRequestException } from "@nestjs/common/http-exception";

export interface FileTypeValidatorOptions {
  fileType: string;
}

@Injectable()
export class FileTypeValidator implements FileValidator {
  constructor(private options: FileTypeValidatorOptions) { }
  validate(file: any): void {
    if (file.mimetype !== this.options.fileType) {
      throw new BadRequestException('File type is not valid');
    }
  }

}
