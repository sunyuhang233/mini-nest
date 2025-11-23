import { BadRequestException, FileValidator, Injectable, PipeTransform } from "../../index";
export interface ParseFilePipeOptions {
  validators?: FileValidator[];
}

@Injectable()
export class ParseFilePipe implements PipeTransform {
  constructor(private options: ParseFilePipeOptions = {}) { }
  transform(file: any): any {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (this.options.validators) {
      for (const validator of this.options.validators) {
        validator.validate(file);
      }
    }
    return file;
  }
}
