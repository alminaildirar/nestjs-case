import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieRepository } from '../../src/movies/repository/movie.repository';
import { Movie, MovieDocument } from '../../src/movies/models/movie.model';
import { MovieCreateDTO } from '../../src/movies/dto/movie-create.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockMovie = {
  id: '1',
  name: 'Test Movie',
  overview: 'This is a test movie',
  popularity: 10,
  voteAverage: 7.5,
  voteCount: 100,
  releaseDate: '2024-01-01',
  genres: [{ id: 1, name: 'Action' }],
};

describe('MovieRepository', () => {
  let repository: MovieRepository;
  let model: Model<MovieDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieRepository,
        {
          provide: getModelToken(Movie.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            bulkWrite: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MovieRepository>(MovieRepository);
    model = module.get<Model<MovieDocument>>(getModelToken(Movie.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('storeMovies', () => {
    it('should store movies', async () => {
      const bulkWriteMock = jest.fn().mockResolvedValueOnce({});
      (model.bulkWrite as jest.Mock).mockImplementationOnce(bulkWriteMock);

      await repository.storeMovies([mockMovie as MovieCreateDTO]);

      expect(model.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: { id: mockMovie.id },
            update: { $set: mockMovie },
            upsert: true,
          },
        },
      ]);
    });

    it('should throw an error if storing movies fails', async () => {
      const bulkWriteMock = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed to store movies'));
      (model.bulkWrite as jest.Mock).mockImplementationOnce(bulkWriteMock);

      await expect(
        repository.storeMovies([mockMovie as MovieCreateDTO]),
      ).rejects.toThrow('Failed to store movies');
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const execMock = jest.fn().mockResolvedValueOnce([mockMovie]);
      (model.find as jest.Mock).mockReturnValue({ exec: execMock } as any);

      const movies = await repository.findAll();
      expect(movies).toEqual([mockMovie]);
    });

    it('should throw an error if fetching movies fails', async () => {
      const execMock = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed to fetch movies'));
      (model.find as jest.Mock).mockReturnValue({ exec: execMock } as any);

      await expect(repository.findAll()).rejects.toThrow(
        'Failed to fetch movies',
      );
    });
  });

  describe('findById', () => {
    it('should find a movie by id', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockMovie);
      (model.findOne as jest.Mock).mockReturnValue({ exec: execMock } as any);

      const movie = await repository.findById('1');
      expect(movie).toEqual(mockMovie);
    });

    it('should throw an error if finding a movie by id fails', async () => {
      const execMock = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed to find movie'));
      (model.findOne as jest.Mock).mockReturnValue({ exec: execMock } as any);

      await expect(repository.findById('1')).rejects.toThrow(
        'Failed to find movie',
      );
    });
  });

  describe('save', () => {
    it('should save a movie', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockMovie);
      (model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: execMock,
      } as any);

      const movie = await repository.save(mockMovie as MovieCreateDTO);
      expect(movie).toEqual(mockMovie);
    });

    it('should throw an error if saving a movie fails', async () => {
      const execMock = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed to save movie'));
      (model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: execMock,
      } as any);

      await expect(
        repository.save(mockMovie as MovieCreateDTO),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('removeById', () => {
    it('should remove a movie by id', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockMovie);
      (model.findOneAndDelete as jest.Mock).mockReturnValue({
        exec: execMock,
      } as any);

      const movie = await repository.removeById('1');
      expect(movie).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      (model.findOneAndDelete as jest.Mock).mockReturnValue({
        exec: execMock,
      } as any);

      await expect(repository.removeById('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if removing a movie by id fails', async () => {
      const execMock = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed to remove movie'));
      (model.findOneAndDelete as jest.Mock).mockReturnValue({
        exec: execMock,
      } as any);

      await expect(repository.removeById('1')).rejects.toThrow(
        'Failed to remove movie',
      );
    });
  });
});
