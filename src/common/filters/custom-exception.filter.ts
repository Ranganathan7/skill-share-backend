import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CommonApiResponse } from '../interceptors/transform.interceptor';
import { headers } from '../constants/constants';

export interface ApiError {
  description: string,
  errorCode: number,
}

export interface ApiErrorResponse {
  error: ApiError
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const requestId = request.headers[headers.requestId];
    const response = ctx.getResponse();
    const status = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = (error instanceof HttpException) ? error.getResponse() : '';
    const errorDescription = exceptionResponse['description'] ?? exceptionResponse['message'] ?? error['detail'] ?? error['message']

    const errorResponse: CommonApiResponse<ApiErrorResponse> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: {
        errorCode: exceptionResponse['errorCode'] ?? error['code'] ?? error.name ?? "InternalServerException",
        description: (errorDescription ? (errorDescription instanceof Array ? errorDescription.join(' | ') : errorDescription) : null) ?? "Something went wrong!",
      },
      requestId,
    }
    response.status(status)
    response.send(errorResponse)
  }
}