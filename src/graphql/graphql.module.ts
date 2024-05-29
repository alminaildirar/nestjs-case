import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MoviesModule } from '../movies/movies.module';
import { MovieResolver } from './movie.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.gql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql/graphql.ts'),
        outputAs: 'class',
      },
      formatError: (error: GraphQLError): GraphQLFormattedError => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            status: error.extensions?.status || 500,
          },
        };
        return graphQLFormattedError;
      },
    }),
    MoviesModule,
  ],
  providers: [MovieResolver],
})
export class GqlModule {}
