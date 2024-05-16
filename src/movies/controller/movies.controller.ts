import { Controller, Get } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../models/movie.model';

@Controller('movies')
export class MovieController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll(): Promise<Movie[]> {
    try {
      return await this.moviesService.findAll();
    } catch (error) {
      throw new Error('Failed to retrieve movies');
    }
  }
}
