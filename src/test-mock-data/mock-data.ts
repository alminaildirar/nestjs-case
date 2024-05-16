import { TmdbApiResponse } from '../movies/interfaces/tmdb-movies-response';
import { MovieDetailResponse } from '../movies/interfaces/tmdb-movie-detail-response';
import { MovieCreateDTO } from 'src/movies/dto/movie-create.dto';
import { Movie } from 'src/movies/models/movie.model';

export const mockTmdbApiResponse: TmdbApiResponse = {
  page: 1,
  results: [
    {
      adult: false,
      backdrop_path: '/test_backdrop.jpg',
      genre_ids: [1, 2, 3],
      id: 1,
      original_language: 'en',
      original_title: 'Test Movie',
      overview: 'Test overview',
      popularity: 10,
      poster_path: '/test_poster.jpg',
      release_date: '2020-01-01',
      title: 'Test Movie',
      video: false,
      vote_average: 8.5,
      vote_count: 1000,
    },
  ],
};

export const mockMovieDetailResponse: MovieDetailResponse = {
  adult: false,
  backdrop_path: '/test_backdrop.jpg',
  belongs_to_collection: {
    id: 1,
    name: 'Test Collection',
    poster_path: '/test_collection_poster.jpg',
    backdrop_path: '/test_collection_backdrop.jpg',
  },
  budget: 1000000,
  genres: [{ id: 1, name: 'Action' }],
  homepage: 'http://testhomepage.com',
  id: 1,
  imdb_id: 'tt1234567',
  origin_country: ['US'],
  original_language: 'en',
  original_title: 'Test Movie',
  overview: 'Test overview',
  popularity: 10,
  poster_path: '/test_poster.jpg',
  production_companies: [
    {
      id: 1,
      logo_path: '/test_logo.jpg',
      name: 'Test Company',
      origin_country: 'US',
    },
  ],
  production_countries: [{ iso_3166_1: 'US', name: 'United States' }],
  release_date: '2020-01-01',
  revenue: 2000000,
  runtime: 120,
  spoken_languages: [
    { english_name: 'English', iso_639_1: 'en', name: 'English' },
  ],
  status: 'Released',
  tagline: 'Test tagline',
  title: 'Test Movie',
  video: false,
  vote_average: 8.5,
  vote_count: 1000,
};

export const mockMovieDTO: MovieCreateDTO = {
  id: '1',
  name: 'Test Movie',
  overview: 'This is a test movie',
  popularity: 10,
  voteAverage: 7.5,
  voteCount: 100,
  releaseDate: '2024-01-01',
  genres: [{ id: 1, name: 'Action' }],
};

export const mockMovie: Movie = {
  id: '1',
  name: 'Test Movie',
  overview: 'This is a test movie',
  popularity: 10,
  voteAverage: 7.5,
  voteCount: 100,
  releaseDate: '2024-01-01',
  genres: [{ id: 1, name: 'Action' }],
};
