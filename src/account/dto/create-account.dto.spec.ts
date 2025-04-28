import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  AddressDto,
  CompanyAccountDto,
  CreateAccountDto,
  IndividualAccountDto,
} from './create-account.dto';
import {
  AccountRoles,
  AccountType,
  fieldConfig,
} from '../../common/constants/constants';

describe('AddressDto', () => {
  let address: AddressDto;

  beforeEach(() => {
    address = plainToInstance(AddressDto, {
      streetNumber: '123',
      streetName: 'Main Street',
      city: 'Sample City',
      state: 'Sample State',
      postCode: '12345',
    });
  });

  describe('streetNumber', () => {
    it('should pass with valid street number', async () => {
      const errors = await validate(address);
      expect(errors.length).toBe(0);
    });

    it('should fail if street number is missing', async () => {
      address.streetNumber = '';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'streetNumber')).toBe(true);
    });

    it('should fail if street number is too long', async () => {
      address.streetNumber = 'A'.repeat(fieldConfig.streetNumber.length + 1);
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'streetNumber')).toBe(true);
    });

    it('should fail if street number does not match regex', async () => {
      address.streetNumber = 'InvalidStreet123';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'streetNumber')).toBe(true);
    });
  });

  describe('streetName', () => {
    it('should pass with valid street name', async () => {
      const errors = await validate(address);
      expect(errors.length).toBe(0);
    });

    it('should fail if street name is missing', async () => {
      address.streetName = '';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'streetName')).toBe(true);
    });

    it('should fail if street name is too long', async () => {
      address.streetName = 'A'.repeat(fieldConfig.streetName.length + 1);
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'streetName')).toBe(true);
    });

    it('should fail if street name does not match regex', async () => {
      address.streetName = 'InvalidStreetName!';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'streetName')).toBe(true);
    });
  });

  describe('city', () => {
    it('should pass with valid city', async () => {
      const errors = await validate(address);
      expect(errors.length).toBe(0);
    });

    it('should fail if city is missing', async () => {
      address.city = '';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'city')).toBe(true);
    });

    it('should fail if city is too long', async () => {
      address.city = 'A'.repeat(fieldConfig.city.length + 1);
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'city')).toBe(true);
    });

    it('should fail if city does not match regex', async () => {
      address.city = 'InvalidCity!';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'city')).toBe(true);
    });
  });

  describe('state', () => {
    it('should pass with valid state', async () => {
      const errors = await validate(address);
      expect(errors.length).toBe(0);
    });

    it('should fail if state is missing', async () => {
      address.state = '';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'state')).toBe(true);
    });

    it('should fail if state is too long', async () => {
      address.state = 'A'.repeat(fieldConfig.state.length + 1);
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'state')).toBe(true);
    });

    it('should fail if state does not match regex', async () => {
      address.state = 'InvalidState123';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'state')).toBe(true);
    });
  });

  describe('postCode', () => {
    it('should pass with valid post code', async () => {
      const errors = await validate(address);
      expect(errors.length).toBe(0);
    });

    it('should fail if post code is missing', async () => {
      address.postCode = '';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'postCode')).toBe(true);
    });

    it('should fail if post code is too long', async () => {
      address.postCode = 'A'.repeat(fieldConfig.postCode.length + 1);
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'postCode')).toBe(true);
    });

    it('should fail if post code does not match regex', async () => {
      address.postCode = 'InvalidPostCode!';
      const errors = await validate(address);
      expect(errors.some((e) => e.property === 'postCode')).toBe(true);
    });
  });
});

describe('IndividualAccountDto', () => {
  let dto: IndividualAccountDto;

  beforeEach(() => {
    dto = plainToInstance(IndividualAccountDto, {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      address: {
        streetNumber: '123',
        streetName: 'Main Street',
        city: 'Sample City',
        state: 'Sample State',
        postCode: '12345',
      },
    });
  });

  describe('firstName', () => {
    it('should pass with valid first name', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if first name is missing', async () => {
      dto.firstName = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'firstName')).toBe(true);
    });

    it('should fail if first name exceeds max length', async () => {
      dto.firstName = 'A'.repeat(fieldConfig.name.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'firstName')).toBe(true);
    });
  });

  describe('lastName', () => {
    it('should pass with valid last name', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if last name is missing', async () => {
      dto.lastName = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'lastName')).toBe(true);
    });

    it('should fail if last name exceeds max length', async () => {
      dto.lastName = 'A'.repeat(fieldConfig.name.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'lastName')).toBe(true);
    });
  });

  describe('mobileNumber', () => {
    it('should pass with valid mobile number', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if mobile number is missing', async () => {
      dto.mobileNumber = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'mobileNumber')).toBe(true);
    });

    it('should fail if mobile number exceeds max length', async () => {
      dto.mobileNumber = '1'.repeat(fieldConfig.mobileNumber.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'mobileNumber')).toBe(true);
    });

    it('should fail if mobile number does not match regex', async () => {
      dto.mobileNumber = '123ABC456';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'mobileNumber')).toBe(true);
    });
  });

  describe('address', () => {
    it('should pass with valid address', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if any field in address is missing', async () => {
      dto.address.streetNumber = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'address')).toBe(true);
    });
  });
});

describe('CompanyAccountDto', () => {
  let dto: CompanyAccountDto;

  beforeEach(() => {
    dto = plainToInstance(CompanyAccountDto, {
      companyName: 'Test Company',
      representativeFirstName: 'John',
      representativeLastName: 'Doe',
      phoneNumber: '1234567890',
      businessTaxNumber: '1234567890',
      address: {
        streetNumber: '123',
        streetName: 'Main Street',
        city: 'Sample City',
        state: 'Sample State',
        postCode: '12345',
      },
    });
  });

  describe('companyName', () => {
    it('should pass with valid company name', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if company name is missing', async () => {
      dto.companyName = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'companyName')).toBe(true);
    });

    it('should fail if company name exceeds max length', async () => {
      dto.companyName = 'A'.repeat(fieldConfig.name.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'companyName')).toBe(true);
    });
  });

  describe('representativeFirstName', () => {
    it('should pass with valid representative first name', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if representative first name is missing', async () => {
      dto.representativeFirstName = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'representativeFirstName')).toBe(
        true,
      );
    });

    it('should fail if representative first name exceeds max length', async () => {
      dto.representativeFirstName = 'A'.repeat(fieldConfig.name.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'representativeFirstName')).toBe(
        true,
      );
    });
  });

  describe('representativeLastName', () => {
    it('should pass with valid representative last name', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if representative last name is missing', async () => {
      dto.representativeLastName = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'representativeLastName')).toBe(
        true,
      );
    });

    it('should fail if representative last name exceeds max length', async () => {
      dto.representativeLastName = 'A'.repeat(fieldConfig.name.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'representativeLastName')).toBe(
        true,
      );
    });
  });

  describe('phoneNumber', () => {
    it('should pass with valid phone number', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if phone number is missing', async () => {
      dto.phoneNumber = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'phoneNumber')).toBe(true);
    });

    it('should fail if phone number exceeds max length', async () => {
      dto.phoneNumber = '1'.repeat(fieldConfig.phoneNumber.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'phoneNumber')).toBe(true);
    });

    it('should fail if phone number does not match regex', async () => {
      dto.phoneNumber = '123ABC456';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'phoneNumber')).toBe(true);
    });
  });

  describe('businessTaxNumber', () => {
    it('should pass with valid business tax number', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if business tax number is missing', async () => {
      dto.businessTaxNumber = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'businessTaxNumber')).toBe(true);
    });

    it('should fail if business tax number exceeds max length', async () => {
      dto.businessTaxNumber = '1'.repeat(
        fieldConfig.businessTaxNumber.length + 1,
      );
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'businessTaxNumber')).toBe(true);
    });

    it('should fail if business tax number does not match regex', async () => {
      dto.businessTaxNumber = 'INVALID';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'businessTaxNumber')).toBe(true);
    });
  });

  describe('address', () => {
    it('should pass with valid address', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should allow no address', async () => {
      dto.address = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if any field in address is invalid', async () => {
      (dto.address as any).streetNumber = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'address')).toBe(true);
    });
  });
});

describe('CreateAccountDto', () => {
  let dto: CreateAccountDto;

  beforeEach(() => {
    dto = plainToInstance(CreateAccountDto, {
      email: 'test@example.com',
      password: 'StrongPwd123!',
      role: AccountRoles.PROVIDER,
      type: AccountType.INDIVIDUAL,
      individualAccount: {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '1234567890',
        address: {
          streetNumber: '123',
          streetName: 'Main Street',
          city: 'Sample City',
          state: 'Sample State',
          postCode: '12345',
        },
      },
      companyAccount: {
        companyName: 'Test Company',
        representativeFirstName: 'John',
        representativeLastName: 'Doe',
        phoneNumber: '1234567890',
        businessTaxNumber: '1234567890',
        address: {
          streetNumber: '123',
          streetName: 'Main Street',
          city: 'Sample City',
          state: 'Sample State',
          postCode: '12345',
        },
      },
    });
  });

  describe('email', () => {
    it('should pass with valid email', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when email is missing', async () => {
      dto.email = '';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'email')).toBe(true);
    });

    it('should fail when email format is wrong', async () => {
      dto.email = 'wrong-email-format';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'email')).toBe(true);
    });
  });

  describe('password', () => {
    it('should fail if password is too short', async () => {
      dto.password = 'short';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'password')).toBe(true);
    });

    it('should fail if password is too long', async () => {
      dto.password = 'a'.repeat(fieldConfig.password.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'password')).toBe(true);
    });

    it('should fail if password does not match regex', async () => {
      dto.password = 'weakpassword'; // Assuming regex expects symbols etc
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'password')).toBe(true);
    });
  });

  describe('role', () => {
    it('should fail if role is invalid', async () => {
      dto.role = 'INVALID_ROLE' as any;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'role')).toBe(true);
    });
  });

  describe('type', () => {
    it('should fail if type is invalid', async () => {
      dto.type = 'INVALID_TYPE' as any;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });
  });

  describe('individualAccount (optional)', () => {
    it('should allow no individualAccount', async () => {
      dto.individualAccount = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should not allow invalid individualAccount', async () => {
      dto.individualAccount = plainToInstance(IndividualAccountDto, {
        firstName: 123, // Invalid type, should be string
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'individualAccount')).toBe(true);
    });
  });

  describe('companyAccount (optional)', () => {
    it('should allow no companyAccount', async () => {
      dto.companyAccount = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should not allow invalid companyAccount', async () => {
      dto.companyAccount = plainToInstance(CompanyAccountDto, {
        companyName: 123, // Invalid type, should be string
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'companyAccount')).toBe(true);
    });
  });
});
