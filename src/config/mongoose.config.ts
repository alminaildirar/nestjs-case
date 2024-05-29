import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configurationService: ConfigurationService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configurationService.mongoDbUri,
    };
  }
}
