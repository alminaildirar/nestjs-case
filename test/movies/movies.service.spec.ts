import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../../src/movies/services/movies.service';
import { TmdbApiService } from '../../src/movies/services/tmdb-api.service';
import { MovieRepository } from '../../src/movies/repository/movie.repository';
import { MovieMapper } from '../../src/movies/mappers/movie.mapper';
import {
  mockMovieDTO,
  mockMovieDetailResponse,
  mockTmdbApiResponse,
  mockMovie,
} from '../test-mock-data/mock-data';

describe('MoviesService', () => {
  let service: MoviesService;
  let tmdbApiService: TmdbApiService;
  let movieRepository: MovieRepository;
  let movieMapper: MovieMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: TmdbApiService,
          useValue: {
            fetchMovies: jest
              .fn()
              .mockResolvedValue(mockTmdbApiResponse.results),
            fetchMovieDetails: jest
              .fn()
              .mockResolvedValue(mockMovieDetailResponse),
          },
        },
        {
          provide: MovieRepository,
          useValue: {
            storeMovies: jest.fn().mockResolvedValue(undefined),
            findAll: jest.fn().mockResolvedValue([mockMovie]),
            findById: jest.fn().mockResolvedValue(mockMovie),
            save: jest.fn().mockResolvedValue(mockMovie),
            removeById: jest.fn().mockResolvedValue(mockMovie),
          },
        },
        {
          provide: MovieMapper,
          useValue: {
            mapToDTO: jest.fn().mockResolvedValue(mockMovieDTO),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    tmdbApiService = module.get<TmdbApiService>(TmdbApiService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
    movieMapper = module.get<MovieMapper>(MovieMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAndStoreMovies', () => {
    it('should fetch and store movies', async () => {
      await service.getAndStoreMovies();

      expect(tmdbApiService.fetchMovies).toHaveBeenCalled();
      expect(tmdbApiService.fetchMovieDetails).toHaveBeenCalledTimes(1);
      expect(movieMapper.mapToDTO).toHaveBeenCalledTimes(1);
      expect(movieRepository.storeMovies).toHaveBeenCalledWith([mockMovieDTO]);
    });

    it('should throw an error if fetching movies fails', async () => {
      (tmdbApiService.fetchMovies as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch movies'),
      );

      await expect(service.getAndStoreMovies()).rejects.toThrow(
        'Failed to fetch and store movies',
      );
    });

    it('should throw an error if fetching movie details fails', async () => {
      (tmdbApiService.fetchMovieDetails as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch movie details'),
      );

      await expect(service.getAndStoreMovies()).rejects.toThrow(
        'Failed to fetch and store movies',
      );
    });

    it('should throw an error if mapping to DTO fails', async () => {
      (movieMapper.mapToDTO as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to map to DTO'),
      );

      await expect(service.getAndStoreMovies()).rejects.toThrow(
        'Failed to fetch and store movies',
      );
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockMovie]);
      expect(movieRepository.findAll).toHaveBeenCalled();
    });

    it('should throw an error if fetching all movies fails', async () => {
      (movieRepository.findAll as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to retrieve movies'),
      );

      await expect(service.findAll()).rejects.toThrow(
        'Failed to retrieve movies',
      );
    });
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      const result = await service.findById('1');
      expect(result).toEqual(mockMovie);
      expect(movieRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if fetching movie by id fails', async () => {
      (movieRepository.findById as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to retrieve movie'),
      );

      await expect(service.findById('1')).rejects.toThrow(
        'Failed to retrieve movies',
      );
    });
  });

  describe('save', () => {
    it('should save a movie', async () => {
      const result = await service.save(mockMovieDTO);
      expect(result).toEqual(mockMovie);
      expect(movieRepository.save).toHaveBeenCalledWith(mockMovieDTO);
    });
  });

  describe('removeById', () => {
    it('should remove a movie by id', async () => {
      const result = await service.removeById('1');
      expect(result).toEqual(mockMovie);
      expect(movieRepository.removeById).toHaveBeenCalledWith('1');
    });
  });
});
