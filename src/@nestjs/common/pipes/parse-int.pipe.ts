import { BadRequestException } from "../http-exception";
import { PipeTransform } from "./pipe-transform.interface";

export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10)
    if (isNaN(val)) {
      throw new BadRequestException("参数转换失败")
    }
    return val
  }
}
