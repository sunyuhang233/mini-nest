import { PipeTransform, ArgumentMetadata, Injectable } from "@nestjs/common";
@Injectable()
export class CustomPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    console.log(value, 'value-------------', metadata)
    return value
  }
}
