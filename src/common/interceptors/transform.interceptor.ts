import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type CommonApiResponse<T extends Record<string, any> = Record<string, any>> = T & {
  statusCode: number,
  timestamp: string,
}

export interface ApiSuccessResponse<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const statusCode = context
      .switchToHttp()
      .getResponse().statusCode;

    return next.handle().pipe(
      map((response) => {
        return this.constuctResponse(response, statusCode);
      }),
    );
  }

  private constuctResponse(
    data: any,
    statusCode: number,
  ) {
    const apiResponse: CommonApiResponse<ApiSuccessResponse<typeof data>> = {
      statusCode,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
      },
    };
    return apiResponse
  }
}