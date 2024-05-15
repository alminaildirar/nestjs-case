import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpClientService } from 'src/common/http-client/http-client.service';
import { ConfigurationService } from '../../config/configuration.service';
import {
  MovieApiResult,
  TmdbApiResponse,
} from '../interfaces/tmdb-movies-response';

@Injectable()
export class TmdbApiService {
  constructor(
    private readonly configService: ConfigurationService,
    private readonly httpClientService: HttpClientService,
  ) {}

  async fetchMovies(): Promise<MovieApiResult[]> {
    const url = 'https://api.themoviedb.org/3/discover/movie';
    const params = {
      api_key: this.configService.tmdbApiKey,
      include_adult: false,
      include_video: false,
      language: 'en-US',
      page: 1,
      sort_by: 'primary_release_date.asc',
      'vote_average.gte': 8.4,
      'vote_count.gte': 1500,
      watch_region: 'TR',
      with_watch_providers: 8,
    };

    try {
      const response = await firstValueFrom(
        this.httpClientService.get<TmdbApiResponse>(url, params),
      );
      return response.results;
    } catch (error) {
      console.error('Failed to fetch movies from TMDB:', error);
      throw new Error('Failed to fetch movies');
    }
  }
}