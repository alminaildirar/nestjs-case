import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GenreDto {
  @ApiProperty({ description: 'The unique identifier of the genre' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'The name of the genre' })
  @IsString()
  name: string;
}

export class MovieCreateDTO {
  @ApiProperty({ description: 'The unique identifier of the movie' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The name of the movie' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The overview or summary of the movie' })
  @IsString()
  overview: string;

  @ApiProperty({ description: 'The popularity score of the movie' })
  @IsNumber()
  popularity: number;

  @ApiProperty({ description: 'The average vote score of the movie' })
  @IsNumber()
  voteAverage: number;

  @ApiProperty({
    description: 'The total number of votes the movie has received',
  })
  @IsNumber()
  voteCount: number;

  @ApiProperty({ description: 'The release date of the movie' })
  @IsString()
  releaseDate: string;

  @ApiProperty({
    type: [GenreDto],
    description: 'The genres associated with the movie',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenreDto)
  genres: GenreDto[];
}
