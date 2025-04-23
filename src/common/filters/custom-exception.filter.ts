import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CommonApiResponse } from '../interceptors/transform.interceptor';

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
      }
    }
    response.status(status)
    response.send(errorResponse)
  }
}