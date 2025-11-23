import { BadRequestException, FileValidator, Injectable } from "../../index";

export interface MaxFileSizeValidatorOptions {
  maxSize: number;
}

@Injectable()
export class MaxFileSizeValidator implements FileValidator {
  constructor(private options: MaxFileSizeValidatorOptions) { }
  validate(file: any): void {
    if (file.size > this.options.maxSize) {
      throw new BadRequestException('File size is too large');
    }
  }
}
