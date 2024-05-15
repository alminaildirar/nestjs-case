import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientModule } from './common/http-client/http-client.module';
import { ConfigurationModule } from './config/configuration.module';

@Module({
  imports: [HttpClientModule, ConfigurationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
