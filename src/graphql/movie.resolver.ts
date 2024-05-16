import { Resolver, Query, Args } from '@nestjs/graphql';
import { MoviesService } from 'src/movies/services/movies.service';
import { Movie } from './movie.model';

@Resolver('Movie')
export class MovieResolver {
  constructor(private readonly moviesService: MoviesService) {}

  @Query('findById')
  async findById(@Args('id') id: string): Promise<Movie> {
    return this.moviesService.findById(id);
  }
}
