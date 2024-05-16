import { Catch } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(GraphQLError)
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: GraphQLError, host: GqlArgumentsHost) {
    return exception;
  }
}
