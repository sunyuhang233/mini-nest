import { BadRequestException } from "../http-exception";
import { PipeTransform } from "./pipe-transform.interface";

export class ParseBoolPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    if (value.toLowerCase() === 'true') {
      return true
    } else if (value.toLowerCase() === 'false') {
      return false
    } else {
      throw new BadRequestException("参数转换失败")
    }
  }
}
