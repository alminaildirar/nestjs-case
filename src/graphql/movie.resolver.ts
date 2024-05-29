import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseFilters } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { MoviesService } from '../movies/services/movies.service';
import { GraphQLExceptionFilter } from '../common/filters/graphql-exception.filter';
import { Movie } from './movie.model';

@Resolver('Movie')
export class MovieResolver {
  constructor(private readonly moviesService: MoviesService) {}

  @Query((returns) => Movie, { name: 'findById' })
  @UseFilters(GraphQLExceptionFilter)
  async findById(@Args('id') id: string): Promise<Movie> {
    const movie = await this.moviesService.findById(id);
    if (!movie) {
      throw new GraphQLError(`Movie with id ${id} not found`, {
        extensions: {
          code: 'NOT_FOUND',
          status: 404,
        },
      });
    }
    return movie;
  }
}
