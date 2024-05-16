import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from '../../src/movies/controller/movies.controller';
import { MoviesService } from '../../src/movies/services/movies.service';
import { NotFoundException, ValidationPipe } from '@nestjs/common';
import { Movie } from '../../src/movies/models/movie.model';
import { MovieCreateDTO } from '../../src/movies/dto/movie-create.dto';
import { mockMovieDTO } from '../test-mock-data/mock-data';

describe('MovieController', () => {
  let movieController: MovieController;
  let moviesService: MoviesService;

  const mockMoviesService = {
    findAll: jest.fn().mockResolvedValue([mockMovieDTO as Movie]),
    findById: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({ ...mockMovieDTO, id } as Movie),
      ),
    save: jest
      .fn()
      .mockImplementation((movie: MovieCreateDTO) =>
        Promise.resolve({ ...movie, id: '1' } as Movie),
      ),
    removeById: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({ ...mockMovieDTO, id } as Movie),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      await expect(movieController.findAll()).resolves.toEqual([mockMovieDTO]);
    });

    it('should throw an error if service fails', async () => {
      jest
        .spyOn(moviesService, 'findAll')
        .mockRejectedValueOnce(new Error('Failed to retrieve movies'));
      await expect(movieController.findAll()).rejects.toThrowError(
        'Failed to retrieve movies',
      );
    });
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      await expect(movieController.findById('1')).resolves.toEqual(
        mockMovieDTO,
      );
    });

    it('should throw NotFoundException if movie is not found', async () => {
      jest.spyOn(moviesService, 'findById').mockResolvedValueOnce(null);
      await expect(movieController.findById('2')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('save', () => {
    it('should create or update a movie', async () => {
      await expect(movieController.save(mockMovieDTO)).resolves.toEqual(
        mockMovieDTO,
      );
    });

    it('should validate movie data', async () => {
      const dto = {
        name: '',
        overview: '',
        releaseDate: '',
        genres: [],
      };
      const validationPipe = new ValidationPipe({ transform: true });
      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: MovieCreateDTO,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('removeById', () => {
    it('should delete a movie by id', async () => {
      await expect(movieController.removeById('1')).resolves.toEqual(
        mockMovieDTO,
      );
    });

    it('should throw NotFoundException if movie is not found', async () => {
      jest.spyOn(moviesService, 'removeById').mockResolvedValueOnce(null);
      await expect(movieController.removeById('2')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
