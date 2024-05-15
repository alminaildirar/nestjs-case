import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [MoviesModule, ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class TasksModule {}
