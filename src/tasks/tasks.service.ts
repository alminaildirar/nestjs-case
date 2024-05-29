import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesService } from '../movies/services/movies.service';

@Injectable()
export class TasksService {
  constructor(private moviesService: MoviesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('Cron job started at:', new Date());
    await this.moviesService.getAndStoreMovies();
    console.log('Cron job completed at:', new Date());
  }
}
