import {
  ExecutionContext,
  BadRequestException,
  CallHandler,
} from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';
import { headers } from '../constants/constants';
import { Logger } from 'winston';
import { Observable } from 'rxjs';

// Mock Logger
const mockLogger = {
  info: jest.fn(),
} as unknown as Logger;

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;
  let mockContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new TransformInterceptor(mockLogger);
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
          method: 'GET',
          url: '/test',
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
        }),
      }),
    } as any;
    mockCallHandler = {
      handle: jest.fn(() => of('raw response')),
    } as CallHandler;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should throw BadRequestException if requestId header is missing', async () => {
    try {
      await interceptor.intercept(mockContext, mockCallHandler).toPromise();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it('should log request and response and transform data on success', async () => {
    const requestId = 'test-request-id';
    mockContext.switchToHttp().getRequest().headers[headers.requestId] =
      requestId;
    const statusCode = mockContext.switchToHttp().getResponse().statusCode;
    const rawResponse = { some: 'data' };
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(rawResponse));

    const result = await interceptor
      .intercept(mockContext, mockCallHandler)
      .toPromise();

    expect(mockLogger.info).toHaveBeenCalledWith(`Request: GET /test`, [
      requestId,
    ]);
    expect(mockLogger.info).toHaveBeenCalledWith(`Response: GET /test`, [
      requestId,
    ]);
    expect(result).toEqual({
      statusCode: statusCode,
      timestamp: expect.any(String),
      data: rawResponse,
      requestId: requestId,
    });
  });

  it('should handle different status codes in the response', async () => {
    const requestId = 'another-id';
    mockContext.switchToHttp().getRequest().headers[headers.requestId] =
      requestId;
    mockContext.switchToHttp().getResponse().statusCode = 201;
    (mockCallHandler.handle as jest.Mock).mockReturnValue(
      of({ message: 'created' }),
    );

    const result = (await interceptor
      .intercept(mockContext, mockCallHandler)
      .toPromise()) as any;

    expect(result.statusCode).toBe(201);
    expect(result.data).toEqual({ message: 'created' });
    expect(result.requestId).toBe(requestId);
  });
});
