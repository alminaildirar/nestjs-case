import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  InternalServerErrorException,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../models/movie.model';
import { MovieCreateDTO } from '../dto/movie-create.dto';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of movies.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(): Promise<Movie[]> {
    try {
      return await this.moviesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve movies');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the movie.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findById(@Param('id') id: string): Promise<Movie> {
    try {
      const movie = await this.moviesService.findById(id);
      if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }
      return movie;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve the movie');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create or update a movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: MovieCreateDTO })
  @UsePipes(new ValidationPipe({ transform: true }))
  async save(@Body() movie: MovieCreateDTO): Promise<Movie> {
      try {
      return await this.moviesService.save(movie);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save the movie');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({ name: 'id', description: 'The ID of the movie to delete' })
 async removeById(@Param('id') id: string): Promise<Movie> {
    try {
      const movie = await this.moviesService.removeById(id);
      if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }
      return movie;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete the movie');
    }
  }
}
