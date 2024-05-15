import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Movie, MovieSchema } from './models/movie.model';
import { HttpClientModule } from 'src/common/http-client/http-client.module';
import { ConfigurationModule } from '../config/configuration.module';

import { TmdbApiService } from './services/tmdb-api.service';
import { MovieRepository } from './repository/movie.repository';
import { MovieController } from './controller/movies.controller';
import { MoviesService } from './services/movies.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ConfigurationModule,
    HttpClientModule,
  ],
  controllers: [MovieController],
  providers: [MoviesService, TmdbApiService, MovieRepository],
  exports: [MoviesService],
})
export class MoviesModule {}