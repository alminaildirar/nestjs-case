import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../models/movie.model';
import { MovieCreateDTO } from '../dto/movie-create.dto';

@Injectable()
export class MovieRepository {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
  ) {}

  async storeMovies(movies: MovieCreateDTO[]): Promise<void> {
    try {
      for (const movie of movies) {
        await this.movieModel.updateOne(
          { id: movie.id },
          { $set: movie },
          { upsert: true },
        );
      }
      console.log('Movies stored successfully!');
    } catch (error) {
      console.error('Failed to store movies:', error);
      throw new Error('Failed to store movies');
    }
  }
}
