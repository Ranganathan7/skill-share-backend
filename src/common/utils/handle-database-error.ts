import { HttpException, HttpStatus } from "@nestjs/common";

export const handleDatabaseError = (error) => {
  throw new HttpException(
    {
      errorCode: error.code || 'UnknownDatabaseError',
      description: error.detail || error.message || 'An unknown database error occurred',
    },
    HttpStatus.BAD_REQUEST,
  );
}