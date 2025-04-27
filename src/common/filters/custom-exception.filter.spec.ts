import { CustomExceptionFilter } from './custom-exception.filter';
import { Logger } from 'winston';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('CustomExceptionFilter', () => {
  let exceptionFilter: CustomExceptionFilter;
  let logger: Logger;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
    } as any;  // mock logger
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { 'request-id': '123' },
          method: 'GET',
          url: '/test',
        }),
        getResponse: jest.fn().mockReturnValue({
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        }),
      }),
    } as any;  // mock ArgumentsHost

    exceptionFilter = new CustomExceptionFilter(logger);
  });

  it('should be defined', () => {
    expect(exceptionFilter).toBeDefined();
  });

  it('should log the error and send the correct response when error is an instance of HttpException', () => {
    const error = new HttpException(
      {
        errorCode: 'CUSTOM_ERROR',
        description: 'Custom error occurred',
      },
      HttpStatus.BAD_REQUEST,
    );

    const mockRequest = { headers: { 'request-id': '123' }, method: 'GET', url: '/test' };
    const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    jest.spyOn(mockHost, 'switchToHttp').mockReturnValueOnce({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    } as any);

    exceptionFilter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      error: {
        errorCode: 'CUSTOM_ERROR',
        description: 'Custom error occurred',
      },
      requestId: '123',
    });
  });

  it('should log the error and send the correct response when error is an instance of HttpException without errorCode', () => {
    const error = new HttpException(
      {
        description: 'Custom error occurred',
      },
      HttpStatus.BAD_REQUEST,
    );

    const mockRequest = { headers: { 'request-id': '123' }, method: 'GET', url: '/test' };
    const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    jest.spyOn(mockHost, 'switchToHttp').mockReturnValueOnce({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    } as any);

    exceptionFilter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      error: {
        errorCode: 'HttpException',
        description: 'Custom error occurred',
      },
      requestId: '123',
    });
  });

  it('should log the error and send the correct response when error is an instance of HttpException with array description', () => {
    const error = new HttpException(
      {
        description: ['test'],
      },
      HttpStatus.BAD_REQUEST,
    );

    const mockRequest = { headers: { 'request-id': '123' }, method: 'GET', url: '/test' };
    const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    jest.spyOn(mockHost, 'switchToHttp').mockReturnValueOnce({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    } as any);

    exceptionFilter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      error: {
        errorCode: 'HttpException',
        description: 'test',
      },
      requestId: '123',
    });
  });

  it('should log the error and send the correct response when error is an instance of HttpException without description', () => {
    const error = new Error()

    const mockRequest = { headers: { 'request-id': '123' }, method: 'GET', url: '/test' };
    const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    jest.spyOn(mockHost, 'switchToHttp').mockReturnValueOnce({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    } as any);

    exceptionFilter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      error: {
        errorCode: 'InternalServerException',
        description: 'Something went wrong!',
      },
      requestId: '123',
    });
  });
});
