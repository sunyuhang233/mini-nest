import { PipeTransform } from "./pipe-transform.interface";

export class DefaultValuePipe implements PipeTransform<any, any> {
  constructor(private defaultValue: any) { }
  transform(value: any): any {
    return value ?? this.defaultValue
  }
}
