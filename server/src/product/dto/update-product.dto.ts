import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  price: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  validity?: Date;
}
