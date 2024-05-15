import { Controller } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly moviesService: MoviesService) {}
}
