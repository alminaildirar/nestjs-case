import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientModule } from './common/http-client/http-client.module';
import { ConfigurationModule } from './config/configuration.module';
import { MongooseConfigService } from './config/mongoose.config';
import { ConfigurationService } from './config/configuration.service';
import { TasksModule } from './tasks/tasks.module';
import { GqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    GqlModule,
    HttpClientModule,
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      useClass: MongooseConfigService,
      inject: [ConfigurationService],
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
