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
      const bulkOps = movies.map((movie) => ({
        updateOne: {
          filter: { id: movie.id },
          update: { $set: movie },
          upsert: true,
        },
      }));

      await this.movieModel.bulkWrite(bulkOps);
    } catch (error) {
      throw new Error('Failed to store movies');
    }
  }

  async findAll(): Promise<Movie[]> {
    try {
      return await this.movieModel.find().exec();
    } catch (error) {
      throw new Error('Failed to fetch movies');
    }
  }

  async findById(id: string): Promise<Movie> {
    try {
      return await this.movieModel.findOne({ id }).exec();
    } catch (error) {
      throw error;
    }
  }
}
