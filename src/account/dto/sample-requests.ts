import { AccountRoles, AccountType } from '../../common/constants/constants';
import { CreateAccountDto } from './create-account.dto';
import { AuthAccountDto } from './authenticate-account.dto';

export const createIndividualUserAccount: CreateAccountDto = {
  email: 'user.jane@example.com',
  password: 'userJane123',
  role: AccountRoles.USER,
  type: AccountType.INDIVIDUAL,
  individualAccount: {
    firstName: 'Jane',
    lastName: 'Doe',
    mobileNumber: '9123456780',
    address: {
      streetNumber: '22',
      streetName: 'Elm Street',
      city: 'Boston',
      state: 'MA',
      postCode: '02118',
    },
  },
};

export const createIndividualProviderAccount: CreateAccountDto = {
  email: 'provider.john@example.com',
  password: 'provJohn321',
  role: AccountRoles.PROVIDER,
  type: AccountType.INDIVIDUAL,
  individualAccount: {
    firstName: 'John',
    lastName: 'Smith',
    mobileNumber: '9988776655',
    address: {
      streetNumber: '88',
      streetName: 'Maple Avenue',
      city: 'Seattle',
      state: 'WA',
      postCode: '98101',
    },
  },
};

export const createCompanyUserAccount: CreateAccountDto = {
  email: 'company.user@example.com',
  password: 'compUser789',
  role: AccountRoles.USER,
  type: AccountType.COMPANY,
  companyAccount: {
    companyName: 'GreenTech Ltd.',
    representativeFirstName: 'Emily',
    representativeLastName: 'Wong',
    phoneNumber: '2233445566',
    businessTaxNumber: 'GTX789654',
    address: {
      streetNumber: '120',
      streetName: 'Innovation Blvd',
      city: 'Austin',
      state: 'TX',
      postCode: '73301',
    },
  },
};

export const createCompanyProviderAccount: CreateAccountDto = {
  email: 'service@buildpro.com',
  password: 'buildPro999',
  role: AccountRoles.PROVIDER,
  type: AccountType.COMPANY,
  companyAccount: {
    companyName: 'BuildPro Services',
    representativeFirstName: 'Michael',
    representativeLastName: 'Lee',
    phoneNumber: '8773344112',
    businessTaxNumber: 'BP998877',
    address: {
      streetNumber: '45',
      streetName: 'Industrial Park',
      city: 'Denver',
      state: 'CO',
      postCode: '80202',
    },
  },
};

export const authenticateAccount: AuthAccountDto = {
  email: createIndividualProviderAccount.email,
  password: createIndividualProviderAccount.password,
};
