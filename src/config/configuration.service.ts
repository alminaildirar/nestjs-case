import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {
    this.ensureEnvVariables(['TMDB_API_KEY', 'MONGODB_URI']);
  }

  private ensureEnvVariables(keys: string[]): void {
    keys.forEach((key) => {
      if (!this.configService.get(key)) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    });
  }

  get port(): number {
    return +this.configService.get<string>('PORT', '3000');
  }

  get mongoDbUri(): string {
    return this.configService.get<string>('MONGODB_URI');
  }

  get tmdbApiKey(): string {
    return this.configService.get<string>('TMDB_API_KEY');
  }
}
