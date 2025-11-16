import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
export class ClassValidationPipe implements PipeTransform {
  async transform(value: any, metadata?: ArgumentMetadata) {
    // 如果没有元类型 或者 不需要验证 则直接返回
    if (!metadata.metatype || !this.needValidate(metadata.metatype)) return value
    const instance = plainToInstance(metadata.metatype, value);
    const errors = await validate(instance);
    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
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
}
