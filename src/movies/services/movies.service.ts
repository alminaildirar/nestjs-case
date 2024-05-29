import { Injectable } from '@nestjs/common';
import { MovieRepository } from '../repository/movie.repository';
import { TmdbApiService } from './tmdb-api.service';
import { MovieMapper } from '../mappers/movie.mapper';
import { MovieCreateDTO } from '../dto/movie-create.dto';
import { MovieDetailResponse } from '../interfaces/tmdb-movie-detail-response';
import { Movie } from '../models/movie.model';

@Injectable()
export class MoviesService {
  constructor(
    private readonly tmdbApiService: TmdbApiService,
    private readonly movieRepository: MovieRepository,
    private readonly movieMapper: MovieMapper,
  ) {}

  async getAndStoreMovies(): Promise<void> {
    try {
      const moviesData = await this.tmdbApiService.fetchMovies();
      const firstFiveMoviesData = moviesData.slice(0, 5);
      const movieDTOs: MovieCreateDTO[] = [];

      for (const movie of firstFiveMoviesData) {
        try {
          const movieDetail: MovieDetailResponse =
            await this.tmdbApiService.fetchMovieDetails(movie.id.toString());
          const movieDTO: MovieCreateDTO =
            await this.movieMapper.mapToDTO(movieDetail);
          movieDTOs.push(movieDTO);
        } catch (error) {
          throw new Error('Failed to get and store movie!');
        }
      }

      await this.movieRepository.storeMovies(movieDTOs);
    } catch (error) {
      throw new Error('Failed to fetch and store movies');
    }
  }

  async findAll(): Promise<Movie[]> {
    try {
      return await this.movieRepository.findAll();
    } catch (error) {
      throw new Error('Failed to retrieve movies');
    }
  }

  async findById(id: string): Promise<Movie> {
    try {
      return await this.movieRepository.findById(id);
    } catch (error) {
      throw new Error('Failed to retrieve movies');
    }
  }

  async save(movie: MovieCreateDTO): Promise<Movie> {
    return this.movieRepository.save(movie);
  }

  async removeById(id: string): Promise<Movie> {
    return this.movieRepository.removeById(id);
  }
}
