import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movies.controller';
import { MoviesService } from '../services/movies.service';
import { NotFoundException, ValidationPipe } from '@nestjs/common';
import { Movie } from '../models/movie.model';
import { MovieCreateDTO } from '../dto/movie-create.dto';

describe('MovieController', () => {
  let movieController: MovieController;
  let moviesService: MoviesService;

  const mockMoviesService = {
    findAll: jest
      .fn()
      .mockResolvedValue([{ id: '1', name: 'Movie 1' } as Movie]),
    findById: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({ id, name: 'Movie 1' } as Movie),
      ),
    save: jest
      .fn()
      .mockImplementation((movie: MovieCreateDTO) =>
        Promise.resolve({ ...movie, id: '1' } as Movie),
      ),
    removeById: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({ id, name: 'Movie 1' } as Movie),
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
      await expect(movieController.findAll()).resolves.toEqual([
        { id: '1', name: 'Movie 1' },
      ]);
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
      await expect(movieController.findById('1')).resolves.toEqual({
        id: '1',
        name: 'Movie 1',
      });
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
      const dto: MovieCreateDTO = {
        name: 'Movie 1',
        overview: 'Overview',
        releaseDate: '2022-01-01',
        genres: [],
      };
      await expect(movieController.save(dto)).resolves.toEqual({
        id: '1',
        ...dto,
      });
    });

    it('should validate movie data', async () => {
      const dto: MovieCreateDTO = {
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
      await expect(movieController.removeById('1')).resolves.toEqual({
        id: '1',
        name: 'Movie 1',
      });
    });

    it('should throw NotFoundException if movie is not found', async () => {
      jest.spyOn(moviesService, 'removeById').mockResolvedValueOnce(null);
      await expect(movieController.removeById('2')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
