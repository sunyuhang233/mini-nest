import {
  IsEmail,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Min(1, { message: i18nValidationMessage('validation.MIN', { constraints: [6] }) })
  password: string;
}
