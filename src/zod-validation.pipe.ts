import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) { }
  transform(value: any, metadata?: ArgumentMetadata) {
    console.log(value, metadata)
    try {
      return this.schema.parse(value)
    } catch (error) {
      throw new BadRequestException("Validation failed")
    }
  }

}
