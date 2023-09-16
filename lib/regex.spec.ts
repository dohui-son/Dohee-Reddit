import { emailRegex, passwordRegex } from './validation/regex';

type TestCase = {
  [key: string]: {
    accept: string[];
    reject: string[];
    regex: RegExp;
  };
};

const testCase: TestCase = {
  password: {
    accept: ['testPass!9@#', 'PassWord1!@#', 'kJasfdn1@#!::A'],
    reject: ['', '12345', '7Short!', 'ThisPasswordLengthExceeds20!'],
    regex: passwordRegex,
  },
  email: {
    accept: [
      'test@gmail.com',
      'Test@gmail.com',
      '1@gmail.com',
      'test123@gmail.com',
      'test@another.com',
    ],
    reject: [
      '',
      'invalid-email',
      '@gmail.com',
      'test!@gmail.com',
      'too@long.domainisnotvalid',
    ],
    regex: emailRegex,
  },
};

describe('Regex test', () => {
  Object.entries(testCase).forEach(([name, value]) => {
    it(`should accept ${name} accept cases`, () => {
      const result = value.accept.every((str) => {
        if (!value.regex.test(str)) {
          console.log(`${name} : failed accepting [${str}]`);
          return false;
        }
        return true;
      });
      expect(result).toBe(true);
    });

    it(`should reject ${name} reject cases`, () => {
      const result = value.reject.every((str) => {
        if (value.regex.test(str)) {
          console.log(`${name} : failed rejecting [${str}]`);
          return false;
        }
        return true;
      });
      expect(result).toBe(true);
    });
  });
});
