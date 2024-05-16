// src/graphql/movie.model.ts

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Movie {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  overview: string;

  @Field({ nullable: true })
  popularity?: number;

  @Field({ nullable: true })
  voteAverage?: number;

  @Field({ nullable: true })
  voteCount?: number;

  @Field()
  releaseDate: string;

  @Field(() => [Genre])
  genres: Genre[];
}

@ObjectType()
export class Genre {
  @Field()
  id: number;

  @Field()
  name: string;
}
