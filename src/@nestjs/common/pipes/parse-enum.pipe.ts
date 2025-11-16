import { BadRequestException } from "../http-exception";
import { PipeTransform } from "./pipe-transform.interface";

export class ParseEnumPipe implements PipeTransform<string, any[]> {
  constructor(private enumType: any) { }
  transform(value: string): any {
    const enumValue = Object.values(this.enumType)
    if (!enumValue.includes(value)) {
      throw new BadRequestException("参数转换失败")
    }
    return value
  }
}
