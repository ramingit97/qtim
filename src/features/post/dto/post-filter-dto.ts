import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PostFilterDto {
  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString() // оставляем как строку, чтобы не упал class-transformer
  publicationDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

}