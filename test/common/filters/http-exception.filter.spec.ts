import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';
import { HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException and return error response', () => {
      const mockJson = jest.fn();
      const mockStatus = jest.fn().mockImplementation(() => ({
        json: mockJson,
      }));

      const mockResponse = {
        status: mockStatus,
      };

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
        }),
        getType: jest.fn().mockReturnValue('http'),
      };

      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockHost as unknown as ArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockJson).toHaveBeenCalledWith({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
        data: null,
      });
    });

    it('should handle non-HttpException and return error response', () => {
      const mockJson = jest.fn();
      const mockStatus = jest.fn().mockImplementation(() => ({
        json: mockJson,
      }));

      const mockResponse = {
        status: mockStatus,
      };

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
        }),
        getType: jest.fn().mockReturnValue('http'),
      };

      const exception = new Error('Something went wrong');

      filter.catch(exception, mockHost as unknown as ArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        data: null,
      });
    });

    it('should return early if the context is graphql', () => {
      const mockHost = {
        getType: jest.fn().mockReturnValue('graphql'),
      };

      expect(() => filter.catch(new Error('Test error'), mockHost as unknown as ArgumentsHost)).not.toThrow();
      expect(mockHost.getType).toHaveBeenCalled();
    });
  });

  describe('getErrorMessage', () => {
    it('should return the message from HttpException response', () => {
      const exception = new HttpException({ message: 'Custom error message' }, HttpStatus.BAD_REQUEST);
      const result = filter['getErrorMessage'](exception);
      expect(result).toBe('Custom error message');
    });

    it('should return the default error message if response is a string', () => {
      const exception = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
      const result = filter['getErrorMessage'](exception);
      expect(result).toBe('Custom error');
    });

    it('should return "Internal server error" for non-HttpException errors', () => {
      const result = filter['getErrorMessage'](new Error('Test error'));
      expect(result).toBe('Internal server error');
    });

    it('should handle an array of messages from HttpException response', () => {
      const exception = new HttpException({ message: ['Error 1', 'Error 2'] }, HttpStatus.BAD_REQUEST);
      const result = filter['getErrorMessage'](exception);
      expect(result).toBe('Error 1, Error 2');
    });
  });
});