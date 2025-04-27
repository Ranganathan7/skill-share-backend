export enum AccountRoles {
  PROVIDER = 'PROVIDER',
  USER = 'USER'
}

export enum AccountType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

export enum SkillCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  TESTING = 'TESTING'
}

export enum RateCurrency {
  USD = 'USD',
  AUD = 'AUD',
  SGD = 'SGD',
  INR = 'INR',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum NatureOfWork {
  ON_SITE = 'ON_SITE',
  ONLINE = 'ONLINE'
}

export const fieldConfig = {
  email: {
    length: 100,
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    minLength: 8,
    length: 20,
    hashedLength: 250,
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
  },
  streetNumber: {
    length: 5,
    regex: /^[0-9]{1,5}$/,
  },
  streetName: {
    length: 50,
    regex: /^[a-zA-Z0-9\s,.'-]{1,50}$/,
  },
  city: {
    length: 15,
    regex: /^[a-zA-Z\s]{1,15}$/,
  },
  state: {
    length: 15,
    regex: /^[a-zA-Z\s]{1,15}$/,
  },
  postCode: {
    length: 6,
    regex: /^[0-9]{4,6}$/,
  },
  mobileNumber: {
    length: 10,
    regex: '^[0-9]{10}$',
  },
  name: {
    length: 50,
  },
  phoneNumber: {
    length: 15,
    regex: '^[0-9]{10,15}$',
  },
  businessTaxNumber: {
    length: 10,
    regex: '^[A-Z0-9]{10}$',
  },
  taskName: {
    length: 50
  },
  taskDescription: {
    length: 100
  }
};

export const swaggerConstants = {
  name: "Skill Share Backend API",
  description: "API docs for skill share backend services",
  version: "1.0",
  uri: "docs"
}

export const headers = {
  authorization: 'authorization',
  requestId: 'request-id'
}

export const loggerConstant = 'LOGGER'

