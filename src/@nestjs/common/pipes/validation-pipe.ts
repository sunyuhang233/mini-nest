import { ArgumentMetadata, BadRequestException, PipeTransform } from "../index";
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata?: ArgumentMetadata) {
    // 如果没有元类型 或者 不需要验证 则直接返回
    if (!metadata.metatype || !this.needValidate(metadata.metatype)) return value
    const instance = plainToInstance(metadata.metatype, value);
    const errors = await validate(instance);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    return value
  }
  /**
   * 是否需要验证
   * @param metatype 元类型
   * @returns 是否需要验证
   */
  private needValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
  /**
   * 格式化错误信息
   * @param errors 验证错误信息
   * @returns 格式化后的错误信息
   */
  private formatErrors(errors: ValidationError[]): string {
    return errors
      .map(err => {
        for (const property in err.constraints) {
          return `${err.property} - ${err.constraints[property]}`;
        }
      })
      .join(', ');
  }
}
