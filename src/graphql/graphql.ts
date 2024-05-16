
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Genre {
    id?: Nullable<number>;
    name?: Nullable<string>;
}

export class Movie {
    id?: Nullable<string>;
    name?: Nullable<string>;
    overview?: Nullable<string>;
    popularity?: Nullable<number>;
    voteAverage?: Nullable<number>;
    voteCount?: Nullable<number>;
    releaseDate?: Nullable<string>;
    genres?: Nullable<Nullable<Genre>[]>;
}

export abstract class IQuery {
    abstract findById(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

type Nullable<T> = T | null;
