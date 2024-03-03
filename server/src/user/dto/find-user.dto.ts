import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from '../../shared/decorators/isEmailCustom';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';

export class FinduserDto {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsEmailCustom()
  email: string;
}
