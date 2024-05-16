import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../src/tasks/tasks.service';

import { CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MoviesService } from '../../src/movies/services/movies.service';

jest.mock('../../src/movies/services/movies.service');

describe('TasksService', () => {
  let tasksService: TasksService;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, MoviesService],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  it('should call getAndStoreMovies method when cron job runs', async () => {
    const getAndStoreMoviesSpy = jest
      .spyOn(moviesService, 'getAndStoreMovies')
      .mockResolvedValue(undefined);

    const cronJob = new CronJob(
      CronExpression.EVERY_DAY_AT_MIDNIGHT,
      async () => {
        await tasksService.handleCron();
      },
    );
    await cronJob.fireOnTick();
    expect(getAndStoreMoviesSpy).toHaveBeenCalled();
  });
});
