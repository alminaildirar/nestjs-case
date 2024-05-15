import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GenreDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class MovieCreateDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  overview: string;

  @IsNumber()
  popularity: number;

  @IsNumber()
  voteAverage: number;

  @IsNumber()
  voteCount: number;

  @IsString()
  releaseDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenreDto)
  genres: GenreDto[];
}
