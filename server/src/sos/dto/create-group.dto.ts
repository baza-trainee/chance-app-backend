import { ApiProperty } from '@nestjs/swagger';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { LengthCustom } from '../../shared/decorators/LengthCustom';

export class CreateGroupDto {
  @ApiProperty()
  @IsStringCustom()
  @LengthCustom(2, 30)
  name: string;
}
