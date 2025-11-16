import { BadRequestException } from "../http-exception";
import { PipeTransform } from "./pipe-transform.interface";

interface ParseArrayOptions {
  items: any
  separator?: string
}

export class ParseArrayPipe implements PipeTransform<string, any[]> {
  constructor(private options: ParseArrayOptions) { }
  transform(value: string): any[] {
    if (!value) {
      return []
    }
    const { items = String, separator = ',' } = this.options || {}
    const val = value.split(separator).map(item => {
      if (items === String) {
        return item
      } else if (items === Number) {
        const value = Number(item)
        if (isNaN(value)) {
          throw new BadRequestException("参数转换失败")
        }
        return value
      } else if (items === Boolean) {
        if (item === 'true') {
          return true
        } else if (item === 'false') {
          return false
        }
        throw new BadRequestException("参数转换失败")
      }
    })
    return val
  }
}
