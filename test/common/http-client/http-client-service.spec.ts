import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { HttpClientService } from '../../../src/common/http-client/http-client.service';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let mockAxios: MockAdapter;

  beforeEach(async () => {
    mockAxios = new MockAdapter(axios);

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpClientService],
    }).compile();

    service = module.get<HttpClientService>(HttpClientService);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should make a GET request and return data', (done) => {
      const mockData = { data: 'test' };
      const url = '/test-url';
      const params = { param1: 'value1' };

      mockAxios.onGet(url, { params }).reply(200, mockData);

      service.get(url, params).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          done();
        },
      });
    });

    it('should handle GET request errors', (done) => {
      const url = '/test-url';
      const params = { param1: 'value1' };

      mockAxios.onGet(url, { params }).reply(500);

      service.get(url, params).subscribe({
        error: (error) => {
          expect(error.response.status).toBe(500);
          done();
        },
      });
    });
  });
});
