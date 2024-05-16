import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { TmdbApiService } from '../../src/movies/services/tmdb-api.service';
import { HttpClientService } from '../../src/common/http-client/http-client.service';
import { ConfigurationService } from '../../src/config/configuration.service';
import {
  mockTmdbApiResponse,
  mockMovieDetailResponse,
} from '../test-mock-data/mock-data';

describe('TmdbApiService', () => {
  let service: TmdbApiService;
  let httpClientService: HttpClientService;
  let configService: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmdbApiService,
        {
          provide: HttpClientService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigurationService,
          useValue: {
            tmdbApiKey: 'test-api-key',
          },
        },
      ],
    }).compile();

    service = module.get<TmdbApiService>(TmdbApiService);
    httpClientService = module.get<HttpClientService>(HttpClientService);
    configService = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchMovies', () => {
    it('should return an array of movies', async () => {
      jest
        .spyOn(httpClientService, 'get')
        .mockReturnValue(of(mockTmdbApiResponse));

      const result = await service.fetchMovies();
      expect(result).toEqual(mockTmdbApiResponse.results);
    });

    it('should throw an error if the request fails', async () => {
      jest
        .spyOn(httpClientService, 'get')
        .mockReturnValue(throwError(() => new Error('Request failed')));

      await expect(service.fetchMovies()).rejects.toThrow(
        'Failed to fetch movies',
      );
    });
  });

  describe('fetchMovieDetails', () => {
    it('should return movie details', async () => {
      jest
        .spyOn(httpClientService, 'get')
        .mockReturnValue(of(mockMovieDetailResponse));

      const result = await service.fetchMovieDetails('1');
      expect(result).toEqual(mockMovieDetailResponse);
    });

    it('should throw an error if the request fails', async () => {
      jest
        .spyOn(httpClientService, 'get')
        .mockReturnValue(throwError(() => new Error('Request failed')));

      await expect(service.fetchMovieDetails('1')).rejects.toThrow(
        'Failed to fetch details for movie 1',
      );
    });
  });
});
