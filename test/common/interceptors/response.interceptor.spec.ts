import { Test, TestingModule } from '@nestjs/testing';
import { ResponseInterceptor } from '../../../src/common/interceptors/response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should format the response correctly', (done) => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({ statusCode: 200 }),
      }),
    };

    const mockCallHandler: Partial<CallHandler> = {
      handle: jest.fn(() => of({ someData: 'test' })),
    };

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe({
        next: (result) => {
          expect(result).toEqual({
            statusCode: 200,
            message: 'Success',
            data: { someData: 'test' },
          });
          done();
        },
      });
  });

  it('should pass through non-2xx status codes', (done) => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({ statusCode: 400 }),
      }),
    };

    const mockCallHandler: Partial<CallHandler> = {
      handle: jest.fn(() => of({ error: 'Bad Request' })),
    };

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe({
        next: (result) => {
          expect(result).toEqual({ error: 'Bad Request' });
          done();
        },
      });
  });

  it('should catch and rethrow errors', (done) => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({ statusCode: 500 }),
      }),
    };

    const mockCallHandler: Partial<CallHandler> = {
      handle: jest.fn(() => throwError(() => new Error('Test error'))),
    };

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe({
        error: (err) => {
          expect(err).toEqual(new Error('Test error'));
          done();
        },
      });
  });
});
