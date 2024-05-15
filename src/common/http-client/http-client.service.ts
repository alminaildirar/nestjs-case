import { Injectable } from '@nestjs/common';
import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { from, Observable } from 'rxjs';

@Injectable()
export class HttpClientService {
  private http: AxiosInstance;
  private baseURL = process.env.BASE_URL || 'default_api_url';

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
      headers: this.setupHeaders(),
    });
    this.injectInterceptors();
  }

  private setupHeaders(hasAttachment: boolean = false): AxiosHeaders {
    return new AxiosHeaders({
      'Content-Type': hasAttachment
        ? 'multipart/form-data'
        : 'application/json',
    });
  }

  private request<T>(
    method: string,
    url: string,
    options: AxiosRequestConfig,
  ): Observable<T> {
    return from(
      this.http
        .request<T>({
          method,
          url,
          ...options,
        })
        .then((response: AxiosResponse<T>) => response.data),
    );
  }

  public get<T>(
    url: string,
    params?: Record<string, any>,
    hasAttachment: boolean = false,
  ): Observable<T> {
    return this.request<T>('GET', url, {
      params,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  private injectInterceptors() {
    this.http.interceptors.request.use((config) => {
      return config;
    });

    this.http.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('Error in HTTP response from:', error.config.url);
        return Promise.reject(error);
      },
    );
  }
}
