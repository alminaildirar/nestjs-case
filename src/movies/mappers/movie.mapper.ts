import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { MovieCreateDTO } from '../dto/movie-create.dto';
import { MovieDetailResponse } from '../interfaces/tmdb-movie-detail-response';

@Injectable()
export class MovieMapper {
  async mapToDTO(movieDetail: MovieDetailResponse): Promise<MovieCreateDTO> {
    const movie = {
      id: movieDetail.id.toString(),
      name: movieDetail.title.toString(),
      overview: movieDetail.overview,
      popularity: movieDetail.popularity,
      voteAverage: movieDetail.vote_average,
      voteCount: movieDetail.vote_count,
      releaseDate: movieDetail.release_date,
      genres: movieDetail.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    };
    const movieDTO = plainToClass(MovieCreateDTO, movie);
    await validateOrReject(movieDTO);
    return movieDTO;
  }
}
