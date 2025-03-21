import { expect } from '@open-wc/testing';
import {
  isValidEmail,
  isValidPhone,
  validateRequired,
  getEmailValidationKey,
  getPhoneValidationKey
} from '../../src/utils/validation.js';

suite('Validation Utils', () => {
  suite('Email Validation', () => {
    test('should validate correct email format', () => {
      expect(isValidEmail('test@example.com')).to.be.true;
      expect(isValidEmail('test.name@example.co.uk')).to.be.true;
      expect(isValidEmail('test+label@example.com')).to.be.true;
    });

    test('should invalidate incorrect email format', () => {
      expect(isValidEmail('test@')).to.be.false;
      expect(isValidEmail('test@example')).to.be.false;
      expect(isValidEmail('test.example.com')).to.be.false;
      expect(isValidEmail('@example.com')).to.be.false;
      expect(isValidEmail('test@.com')).to.be.false;
    });

    test('should allow empty email', () => {
      expect(isValidEmail('')).to.be.true;
      expect(isValidEmail(null)).to.be.true;
      expect(isValidEmail(undefined)).to.be.true;
    });
  });

  suite('Phone Validation', () => {
    test('should validate correct phone format', () => {
      expect(isValidPhone('+1234567890')).to.be.true;
      expect(isValidPhone('+44 1234567890')).to.be.true;
      expect(isValidPhone('+90 532 123 4567')).to.be.true;
    });

    test('should invalidate incorrect phone format', () => {
      expect(isValidPhone('1234567890')).to.be.false;
      expect(isValidPhone('+')).to.be.false;
      expect(isValidPhone('+abc')).to.be.false;
      expect(isValidPhone('+123')).to.be.false;
      expect(isValidPhone('++1234567890')).to.be.false;
    });

    test('should allow empty phone', () => {
      expect(isValidPhone('')).to.be.true;
      expect(isValidPhone(null)).to.be.true;
      expect(isValidPhone(undefined)).to.be.true;
    });
  });

  suite('Required Fields Validation', () => {
    const testData = {
      name: 'John',
      email: 'john@example.com',
      age: 30
    };

    test('should validate required fields', () => {
      const errors = validateRequired(testData, ['name', 'email']);
      expect(errors).to.be.empty;
    });

    test('should return errors for missing required fields', () => {
      const errors = validateRequired(testData, ['name', 'phone']);
      expect(errors).to.have.property('phone', 'validation.required');
    });

    test('should handle multiple missing fields', () => {
      const errors = validateRequired({}, ['name', 'email', 'phone']);
      expect(errors).to.deep.equal({
        name: 'validation.required',
        email: 'validation.required',
        phone: 'validation.required'
      });
    });

    test('should handle empty data object', () => {
      const errors = validateRequired({}, ['name']);
      expect(errors).to.deep.equal({
        name: 'validation.required'
      });
    });

    test('should handle empty fields array', () => {
      const errors = validateRequired(testData, []);
      expect(errors).to.be.empty;
    });

    test('should handle falsy values', () => {
      const data = {
        name: '',
        age: 0,
        active: false,
        valid: true
      };
      
      const errors = validateRequired(data, ['name', 'age', 'active', 'valid']);
      expect(errors).to.have.property('name');
      expect(errors).to.have.property('age');
      expect(errors).to.have.property('active');
      expect(errors).to.not.have.property('valid');
    });
  });

  suite('Validation Message Keys', () => {
    test('should return correct email validation key', () => {
      expect(getEmailValidationKey()).to.equal('validation.invalidEmail');
    });

    test('should return correct phone validation key', () => {
      expect(getPhoneValidationKey()).to.equal('validation.invalidPhone');
    });
  });
}); 