import { ApiOperationOptions } from "@nestjs/swagger";

export const swaggerAPIOptions = {
  createAccount: {
    summary: 'Create account',
    description: 'This API is used to create individual / corporate account'
  },
  authenticateAccount: {
    summary: 'Authenticate account',
    description: 'This API is used to authenticate user email and password'
  }
}