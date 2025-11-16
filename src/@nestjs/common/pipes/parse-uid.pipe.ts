import { BadRequestException } from "../http-exception";
import { PipeTransform } from "./pipe-transform.interface";
import { validate } from 'uuid';
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!validate(value)) {
      throw new BadRequestException("参数转换失败")
    }
    return value
  }
}
