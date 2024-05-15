import { Injectable } from '@nestjs/common';

import { MovieRepository } from '../repository/movie.repository';

@Injectable()
export class MoviesService {
  constructor(private readonly movieRepository: MovieRepository) {}
}
