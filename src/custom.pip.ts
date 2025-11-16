import { PipeTransform, ArgumentMetadata, Injectable, Inject } from "@nestjs/common";
@Injectable()
export class CustomPipe implements PipeTransform {
  constructor(@Inject("PROVIDE") private provide: string) { }
  transform(value: any, metadata: ArgumentMetadata): any {
    return value + '--------' + this.provide
  }
}
