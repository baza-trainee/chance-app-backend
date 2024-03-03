import { PasswordDto } from '../../shared/dto/password.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { IsEmailCustom } from '../../shared/decorators/isEmailCustom';
import { IsNotEmptyEmailCustom } from '../../shared/decorators/isNotEmptyEmailCustom';

export class LoginDto extends PasswordDto {
  @ApiProperty()
  @IsStringCustom()
  @IsEmailCustom()
  @IsNotEmptyEmailCustom()
  email: string;
}
