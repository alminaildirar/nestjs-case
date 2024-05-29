import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ collection: 'netflix.movie' })
export class Movie {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  overview: string;

  @Prop()
  popularity: number;

  @Prop()
  voteAverage: number;

  @Prop()
  voteCount: number;

  @Prop({ required: true })
  releaseDate: string;

  @Prop([{ type: Object }])
  genres: Genre[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

export class Genre {
  id: number;
  name: string;
}
