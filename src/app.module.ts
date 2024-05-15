import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientModule } from './common/http-client/http-client.module';
import { ConfigurationModule } from './config/configuration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongoose.config';
import { ConfigurationService } from './config/configuration.service';

@Module({
  imports: [
    HttpClientModule,
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      useClass: MongooseConfigService,
      inject: [ConfigurationService],
    }),
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
