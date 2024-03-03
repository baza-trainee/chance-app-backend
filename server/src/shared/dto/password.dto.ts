import { ApiProperty } from '@nestjs/swagger';
import { LengthCustom } from '../decorators/LengthCustom';
import { IsStringCustom } from '../decorators/isStringCustom';
import { IsNotEmptyPasswordCustom } from '../decorators/isNotEmptyPasswordCustom';
import { MatchesCustom } from '../decorators/matchesCustom';

export class PasswordDto {
  @ApiProperty()
  @IsStringCustom()
  @LengthCustom(8, 14)
  @MatchesCustom(/^[^а-яА-Я]+$/gmi)
  @IsNotEmptyPasswordCustom()
  password: string;
}
