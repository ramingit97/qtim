import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PostCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  publicationDate: Date;
}
