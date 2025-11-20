import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const maxSize = 1 * 1024;
    if (value.size > maxSize) {
      throw new BadRequestException('File size is too large');
    }
    return value;
  }
}
