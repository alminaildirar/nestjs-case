export class ResponseDTO<T> {
  statusCode: number;
  message: string;
  data: T;
}
