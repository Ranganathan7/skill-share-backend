import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { headers } from '../constants/constants';
import { Logger } from 'winston';

export type CommonApiResponse<T extends Record<string, any> = Record<string, any>> = T & {
  statusCode: number,
  timestamp: string,
  requestId: string,
}

export interface ApiSuccessResponse<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>> {
  constructor(private readonly logger: Logger) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    const statusCode = context
      .switchToHttp()
      .getResponse().statusCode;
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers[headers.requestId];

    if (!requestId) {
      throw new BadRequestException({
        errorCode: 'MissingRequestIDHeader',
        description: 'Request ID header missing',
      });
    }

    const { method, url } = request;
    this.logger.info(
      `Request: ${method} ${url}`,
      [requestId],
    );

    return next.handle().pipe(
      map((response) => {
        this.logger.info(
          `Response: ${method} ${url}`,
          [requestId],
        );
        return this.constuctResponse(response, statusCode, requestId);
      }),
    );
  }

  private constuctResponse(
    data: any,
    statusCode: number,
    requestId: string,
  ) {
    const apiResponse: CommonApiResponse<ApiSuccessResponse<typeof data>> = {
      statusCode,
      timestamp: new Date().toISOString(),
      data,
      requestId
    };
    return apiResponse
  }
}