import { Body, Controller, Get, NotFoundException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../models/movie.model';
import { MovieCreateDTO } from '../dto/movie-create.dto';

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

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Movie> {
    const movie = await this.moviesService.findById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return movie;
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async save(@Body() movie: MovieCreateDTO): Promise<Movie> {
    return this.moviesService.save(movie);
  }
}
